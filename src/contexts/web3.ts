import { polygon, base } from "viem/chains";
import { parseEther, type Hex, type Address, formatEther, stringToHex, hexToString, zeroAddress, numberToHex } from "viem";
import { createConfig, connect, disconnect, readContract, writeContract, watchAccount, http, injected, getAccount, switchChain, reconnect, waitForTransactionReceipt, getClient } from "@wagmi/core";
import { readable, writable } from "svelte/store";
import { cachedStore, consistentStore, eagerStore } from "../helpers/reactivity-helpers";
import { bytesToDelays, bytesToPixelIds, bytesToPixels, pixelIdsToBytes } from "../../contracts/scripts/libraries/pixel-parser"
import { pxlsCoreABI, pxlsNetherABI, magicPlatesABI, trdsCoreABI, pxlsCommonABI } from "../../contracts/generated";

import { execute, AllPixelsByAccountDocument, AllTradesForAccountDocument } from "../../subgraph/.graphclient"
import PixelBalances from "../helpers/pixel-balances";
import { getContractEvents } from "viem/actions";

function savePixels(balances: PixelBalances, blockNumber: bigint, addr: Address, chain: string) {
	localStorage.setItem("pixels_" + addr + "_" + chain, balances.toString())
	localStorage.setItem("pixels_last_block_" + addr + "_" + chain, blockNumber.toString())
}

function getPixels(addr: Address, chain: string) {
	return PixelBalances.fromString(localStorage.getItem("pixels_" + addr + "_" + chain) ?? "")
}

const CONTRACT_ADDRESSES = {
	[base.id]: [import.meta.env.VITE_PXLS_BASE, import.meta.env.VITE_PLTS_BASE],
	[polygon.id]: [import.meta.env.VITE_PXLS_MATIC, import.meta.env.VITE_PLTS_MATIC],
}

const CHAIN_METADATA = {
	[base.id]: { id: base.id, tag: import.meta.env.VITE_TAG_BASE, symbol: import.meta.env.VITE_SYMBOL_BASE },
	[polygon.id]: { id: polygon.id, tag: import.meta.env.VITE_TAG_MATIC, symbol: import.meta.env.VITE_SYMBOL_MATIC },
}

type ChainId = typeof base.id | typeof polygon.id

export function createWeb3Ctx() {
	let PXLS = CONTRACT_ADDRESSES[base.id][0]
	let PLTS = CONTRACT_ADDRESSES[base.id][1]

	const config = createConfig({
		chains: [base, polygon],
		transports: {
			[base.id]: http(import.meta.env.VITE_RPC_BASE),
			[polygon.id]: http(import.meta.env.VITE_RPC_MATIC)
		},
	})

	const isChainSupported = (id: ChainId) => CHAIN_METADATA[id] !== undefined

	const ctx = {
		chain: cachedStore(writable<{ id: ChainId, tag: string, symbol: string }>(CHAIN_METADATA[base.id])),

		account: cachedStore(writable<`0x${string}` | null>()),

		async connect() {
			await disconnect(config)

			let calleeChain: ChainId | undefined
			const params = new URLSearchParams(window.location.search)
			if (params.has("chain")) {
				const chain = params.get("chain")
				calleeChain = Object.values(CHAIN_METADATA).find(c => c.tag === chain)?.id
			} else {
				params.set("chain", ctx.chain.current.tag)
				window.history.replaceState({}, "chain", '?' + params.toString())
			}

			let chainId: ChainId
			let account: Address

			const [connection] = await reconnect(config, { connectors: [injected()] })
			if (connection) {
				chainId = connection.chainId as ChainId
				account = connection.accounts[0]
			} else {
				const connection = await connect(config, { connector: injected() });
				chainId = connection.chainId as ChainId
				account = connection.accounts[0]
			}

			if (calleeChain) {
				if (calleeChain !== ctx.chain.current.id) ctx.switchChain(calleeChain)
				if (chainId !== calleeChain) {
					await switchChain(config, { chainId: calleeChain })
				}
			} else {
				if (isChainSupported(chainId)) {
					if (chainId !== ctx.chain.current.id) ctx.switchChain(chainId)
				} else {
					await switchChain(config, { chainId: ctx.chain.current.id })
				}
			}

			ctx.account.set(account)
		},

		async disconnect() {
			await disconnect(config)
			ctx.account.set(null)
		},

		async ensureConnected() {
			if (!ctx.account.current) {
				await ctx.connect()
			}

			const { chainId } = getAccount(config)
			if (!isChainSupported(chainId as ChainId)) {
				await switchChain(config, { chainId: ctx.chain.current.id })
			}

			return true;
		},

		async switchChain(id: ChainId, walletSwitch = false) {
			if (walletSwitch) {
				await switchChain(config, { chainId: id })
			}

			PXLS = CONTRACT_ADDRESSES[id][0]
			PLTS = CONTRACT_ADDRESSES[id][1]
			ctx.chain.set(CHAIN_METADATA[id])
		},


		price: eagerStore(cachedStore(consistentStore(readable<number>(0.0, (set) => {
			ctx.chain.subscribe(chain => {
				readContract(config, {
					address: PXLS,
					abi: pxlsCommonABI,
					functionName: "price",
					chainId: chain.id
				}).then(r => {
					set(Number(formatEther(r)))
				}).catch(e => {
					set(0.00002)
					console.warn("Failed to fetch pixel price: " + e)
				})
			})
		})))),

		usdPrice: eagerStore(cachedStore(consistentStore(readable<number>(0.0, (set) => {
			ctx.chain.subscribe(chain => {
				fetch(`https://api.redstone.finance/prices/?symbol=${chain.symbol.toUpperCase()}&provider=redstone&limit=1`)
					.then(r => r.json())
					.then(r => set(r?.[0]?.value))
					.catch(e => console.warn("Failed to fetch usd price: " + e))
			})
		})))),

		pixels: eagerStore(consistentStore(writable<PixelBalances>(new PixelBalances(), (set) => {
			ctx.chain.subscribe(chain => {
				ctx.account.subscribe(async acc => {
					if (!acc) {
						set(new PixelBalances())
						return
					}

					set(getPixels(acc, chain.tag)) // optimistically load pixels from storage 

					const storedLastBlock = BigInt(localStorage.getItem("pixels_last_block_" + acc + "_" + chain) ?? "0")

					// if out of sync fetch pixel balances from subgraph // TODO use correct endpoint
					const result = await execute(AllPixelsByAccountDocument, { account: acc.toLowerCase(), block: storedLastBlock.toString() })
					const data: { balances: string, last_block: string } = (result.data?.pixelBalances ?? [])[0]

					if (data) {
						const pixelBalances = data.balances.split(";").reduce((prev, curr) => {
							const raw = curr.split("=")
							if (raw.length > 1) {
								prev.set('0x' + raw[0].padEnd(8, "0") as Hex, Number(raw[1]))
							}
							return prev
						}, new PixelBalances())

						set(pixelBalances)
						savePixels(pixelBalances, BigInt(data.last_block), acc, chain.tag)
					}
				})
			})
		}))),

		plates: consistentStore(writable<Plate[]>([], (set) => {
			ctx.chain.subscribe(chain => {
				ctx.account.subscribe(async acc => {
					if (!acc) {
						set([])
						return
					}

					const plates = (await readContract(config, {
						address: PLTS,
						abi: magicPlatesABI,
						functionName: "platesOf",
						args: [acc],
						chainId: chain.id
					})).map(p => ({
						id: p.id,
						name: hexToString(p.name, { size: 16 }),
						pixels: bytesToPixels(p.pixels),
						delays: bytesToDelays(p.delays).map(arr => ({ idx: arr[0], delay: arr[1] }))
					}));

					set(plates)
				})
			})
		})),

		trades: consistentStore(writable<P2PTrade[]>([], set => {
			ctx.chain.subscribe(chain => {
				ctx.account.subscribe(async acc => {
					if (!acc) {
						set([])
						return
					}

					// TODO: use correct endpoint
					const result = await execute(AllTradesForAccountDocument, { account: acc.toLowerCase() })
					const trades: P2PTrade[] = (result.data?.trades ?? []).map((t: P2PTrade) => (
						{ ...t, pixels: bytesToPixelIds(t.pixels as unknown as Hex), price: BigInt(t.price) }
					))

					set(trades)
				})
			})
		})),


		async openTrade(pixels: PixelId[], receiver: Address, price: bigint, tradeType: number) {
			await ctx.ensureConnected()
			const chainId = ctx.chain.current.id

			const hash = await writeContract(config, {
				address: PXLS,
				abi: trdsCoreABI,
				functionName: "openTrade",
				args: [receiver, pixelIdsToBytes(pixels), price, tradeType],
				value: tradeType === 0 ? 0n : price,
				chainId
			})

			const { status, blockNumber } = await waitForTransactionReceipt(config, { hash, confirmations: 2, chainId })
			if (status == "reverted") throw "reverted"

			const openedEvents = await getContractEvents(getClient(config, { chainId: chainId as 137 }), { // TODO: fix chain id type...
				address: PXLS,
				abi: trdsCoreABI,
				eventName: "TradeOpened",
				args: {
					trade: {
						creator: ctx.account.current!
					}
				},
				fromBlock: blockNumber,
				toBlock: blockNumber
			})

			const tradeId = openedEvents[0]!.args.id!

			if (tradeType == 0) {
				// subtract pixels
				ctx.pixels.update(c => {
					pixels.forEach(id => c.decrease(id))
					const updated = c.copy()
					savePixels(updated, blockNumber, ctx.account.current!, ctx.chain.current.tag)
					return updated
				})
			}

			ctx.trades.update(c => c.concat([{
				id: tradeId,
				creator: ctx.account.current!,
				receiver,
				pixels,
				price,
				tradeType
			}]))

			return tradeId
		},

		async cancelTrade(trade: P2PTrade) {
			await ctx.ensureConnected();
			const chainId = ctx.chain.current.id

			const hash = await writeContract(config, {
				address: PXLS,
				abi: trdsCoreABI,
				functionName: "cancelTrade",
				args: [trade.id],
				chainId
			});

			const { status, blockNumber } = await waitForTransactionReceipt(config, { hash, confirmations: 2, chainId })
			if (status == "reverted") throw "reverted"

			if (trade.tradeType == 0) {
				// restore pixels
				ctx.pixels.update(c => {
					trade.pixels.forEach(id => c.increase(id))
					const updated = c.copy()
					savePixels(updated, blockNumber, ctx.account.current!, ctx.chain.current.tag)
					return updated
				})
			}

			ctx.trades.update(c => {
				c.splice(c.findIndex(t => t.id === trade.id), 1)
				return [...c]
			})
		},

		async closeTrade(trade: P2PTrade) {
			await ctx.ensureConnected();
			const chainId = ctx.chain.current.id

			const hash = await writeContract(config, {
				address: PXLS,
				abi: trdsCoreABI,
				functionName: "closeTrade",
				args: [trade.id],
				value: trade.tradeType === 0 ? trade.price : 0n,
				chainId
			});

			const { status, blockNumber } = await waitForTransactionReceipt(config, { hash, confirmations: 2, chainId })
			if (status == "reverted") throw "reverted"

			ctx.pixels.update(c => {
				const isSell = trade.tradeType === 0
				trade.pixels.forEach(id => isSell ? c.increase(id) : c.decrease(id))
				const updated = c.copy()
				savePixels(updated, blockNumber, ctx.account.current!, ctx.chain.current.tag)
				return updated
			})

			ctx.trades.update(c => {
				c.splice(c.findIndex(t => t.id === trade.id), 1)
				return [...c]
			})
		},

		async getTrade(id: Hex) {
			const trade = await readContract(config, {
				address: PXLS,
				abi: trdsCoreABI,
				functionName: "getTrade",
				args: [id],
				chainId: ctx.chain.current.id
			});
			const pixelIds = bytesToPixelIds(trade.pixels)
			return pixelIds.length ? {
				...trade,
				id,
				pixels: pixelIds
			} as P2PTrade : null
		},

		async conjure(numPixels: number): Promise<[PixelId[], bigint]> {
			await ctx.ensureConnected();
			const chainId = ctx.chain.current.id

			const hash = await writeContract(config, {
				address: PXLS,
				abi: pxlsCoreABI,
				functionName: 'conjure',
				args: [BigInt(numPixels)],
				value: parseEther(ctx.price.current!.toString()) * BigInt(numPixels),
				chainId
			})

			const { status, blockNumber } = await waitForTransactionReceipt(config, { hash, confirmations: 2, chainId })
			if (status == "reverted") throw "reverted"

			const conjuredEvents = await getContractEvents(getClient(config, { chainId: chainId as 137 }), { // TODO: fix chain id type...
				address: PXLS,
				abi: pxlsCoreABI,
				eventName: "Conjured",
				args: {
					to: ctx.account.current
				},
				fromBlock: blockNumber,
				toBlock: blockNumber
			})

			const pixelIds = bytesToPixelIds(conjuredEvents[0].args.pixels!)
			ctx.pixels.update(c => {
				pixelIds.forEach(id => c.increase(id))
				const updated = c.copy()
				savePixels(updated, blockNumber, ctx.account.current!, ctx.chain.current.tag)
				return updated
			})

			const unexpectedFindEvents = await getContractEvents(getClient(config, { chainId: chainId as 137 }), { // TODO: fix chain id type...
				address: PXLS,
				abi: pxlsNetherABI,
				eventName: "UnexpectedFind",
				args: {
					to: ctx.account.current!
				},
				fromBlock: blockNumber,
				toBlock: blockNumber
			})

			const ethFound = unexpectedFindEvents[0]?.args.amount ?? 0n

			return [pixelIds, ethFound]
		},

		async mint(name: string, pixels: PixelId[], delays: Delay[]) {
			await ctx.ensureConnected();
			const chainId = ctx.chain.current.id

			const nameBytes = stringToHex(name, { size: 16 })
			const pixelBytes = pixelIdsToBytes(pixels)
			const delayBytes = "0x" + delays.map(delay => [delay.idx, delay.delay] as const).map(d => d.map(n => numberToHex(n, { size: 2 }).substring(2)).join("")).join("") as Hex

			const hash = await writeContract(config, {
				address: PXLS,
				abi: pxlsCoreABI,
				functionName: 'mint',
				args: [nameBytes, pixelBytes, delayBytes],
				chainId
			})

			const { status, blockNumber } = await waitForTransactionReceipt(config, { hash, confirmations: 2, chainId })
			if (status == "reverted") throw "reverted"

			ctx.pixels.update(c => {
				pixels.forEach(id => c.decrease(id))
				const updated = c.copy()
				savePixels(updated, blockNumber, ctx.account.current!, ctx.chain.current.tag)
				return updated
			})

			const mintedEvents = await getContractEvents(getClient(config, { chainId: chainId as 137 }), { // TODO: fix chain id type...
				address: PLTS,
				abi: magicPlatesABI,
				eventName: "Transfer",
				args: {
					from: zeroAddress,
					to: ctx.account.current!
				},
				fromBlock: blockNumber,
				toBlock: blockNumber
			})

			const tokenId = mintedEvents[0].args.tokenId!

			const rawPlate = (await readContract(config, {
				address: PLTS,
				abi: magicPlatesABI,
				functionName: "plateById",
				args: [tokenId],
				chainId
			}))

			const plate = {
				id: rawPlate.id,
				name: hexToString(rawPlate.name, { size: 16 }),
				pixels: bytesToPixels(rawPlate.pixels),
				delays: bytesToDelays(rawPlate.delays).map(arr => ({ idx: arr[0], delay: arr[1] }))
			} as Plate

			ctx.plates.update(c => c.concat([plate]))

			return plate
		},

		async getPlate(tokenId: bigint) {
			const rawPlate = await readContract(config, {
				address: PLTS,
				abi: magicPlatesABI,
				functionName: "plateById",
				args: [tokenId],
				chainId: ctx.chain.current.id
			})

			return {
				id: rawPlate.id,
				name: rawPlate.name,
				pixels: bytesToPixels(rawPlate.pixels),
				delays: bytesToDelays(rawPlate.delays).map(arr => ({ idx: arr[0], delay: arr[1] }))
			} as Plate
		},

		async shatter(tokenId: bigint) {
			await ctx.ensureConnected();
			const chainId = ctx.chain.current.id

			const hash = await writeContract(config, {
				address: PLTS,
				abi: magicPlatesABI,
				functionName: "burn",
				args: [tokenId],
				chainId
			})

			const { status, blockNumber } = await waitForTransactionReceipt(config, { hash, confirmations: 2, chainId })
			if (status == "reverted") throw "reverted"

			const restoredEvents = await getContractEvents(getClient(config, { chainId: chainId as 137 }), { // TODO: fix chain id type...
				address: PXLS,
				abi: pxlsCoreABI,
				eventName: "Conjured",
				args: {
					to: ctx.account.current
				},
				fromBlock: blockNumber,
				toBlock: blockNumber
			})

			const pixelIds = bytesToPixelIds(restoredEvents[0].args.pixels!)
			ctx.pixels.update(c => {
				// add restored pixels to balances
				pixelIds.forEach(id => c.increase(id))
				const updated = c.copy()
				savePixels(updated, blockNumber, ctx.account.current!, ctx.chain.current.tag)
				return updated
			})

			ctx.plates.update(c => {
				// remove shattered plate
				c.splice(c.findIndex(p => p.id === tokenId), 1)
				return [...c]
			})
		}
	}

	watchAccount(config, {
		onChange(curr, prev) {
			if (prev.chainId !== undefined && prev.chainId !== curr.chainId) {
				const id = curr.chainId as ChainId
				if (CHAIN_METADATA[id] !== undefined) {
					ctx.switchChain(id)
				}
			}
		}
	})

	watchAccount(config, {
		onChange(curr) {
			if (curr.address === undefined) {
				ctx.disconnect()
			}
		}
	})

	ctx.connect().finally(() => {
		ctx.chain.subscribe(chain => {
			const params = new URLSearchParams(window.location.search)
			params.set("chain", chain.tag)
			window.history.replaceState({}, "chain", '?' + params.toString())
		})
	})

	return ctx
}