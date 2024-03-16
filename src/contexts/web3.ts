import { polygon, base } from "viem/chains";
import { parseEther, type Hex, type Address, formatEther, stringToHex, hexToString, zeroAddress, numberToHex } from "viem";
import { createConfig, connect, disconnect, readContract, writeContract, watchAccount, http, injected, getAccount, switchChain, reconnect, waitForTransactionReceipt, getClient, getBalance, readContracts } from "@wagmi/core";
import { readable, writable } from "svelte/store";
import { cachedStore, consistentStore, eagerStore } from "../helpers/store-helpers";
import { bytesToDelays, bytesToPixelIds, bytesToPixels, pixelIdsToBytes } from "../../contracts/scripts/libraries/pixel-parser"
import { pxlsCoreABI, pxlsNetherABI, magicPlatesABI, trdsCoreABI, pxlsCommonABI } from "../../contracts/generated";

import { subgraphExecute, AllPixelsByAccountDocument, AllTradesForAccountDocument } from "../../subgraph/.graphclient"
import PixelBalances from "../helpers/pixel-balances";
import { getContractEvents } from "viem/actions";

function savePixels(balances: PixelBalances, blockNumber: bigint, addr: Address, chain: string) {
	localStorage.setItem("pixels_" + chain + "_" + addr, balances.toString())
	localStorage.setItem("pixels_last_block_" + chain + "_" + addr, blockNumber.toString())
}

function getPixels(addr: Address, chain: string) {
	return PixelBalances.fromString(localStorage.getItem("pixels_" + chain + "_" + addr) ?? "")
}

const CHAINS = {
	[base.id]: {
		id: base.id, tag: import.meta.env.VITE_TAG_BASE as string, symbol: import.meta.env.VITE_SYMBOL_BASE as string,
		contracts: { pxls: import.meta.env.VITE_PXLS_BASE as Address, plts: import.meta.env.VITE_PLTS_BASE as Address }
	},
	[polygon.id]: {
		id: polygon.id, tag: import.meta.env.VITE_TAG_MATIC as string, symbol: import.meta.env.VITE_SYMBOL_MATIC as string,
		contracts: { pxls: import.meta.env.VITE_PXLS_MATIC as Address, plts: import.meta.env.VITE_PLTS_MATIC as Address }
	},
}

type ChainId = keyof typeof CHAINS

const DEFAULT_CHAIN = base.id

export function createWeb3Ctx() {
	const config = createConfig({
		chains: [base, polygon],
		transports: {
			[base.id]: http(import.meta.env.VITE_RPC_BASE),
			[polygon.id]: http(import.meta.env.VITE_RPC_MATIC)
		},
	})

	const isChainSupported = (id: ChainId | undefined) => CHAINS[id as keyof typeof CHAINS] !== undefined

	const ctx = {
		chain: cachedStore(writable<typeof CHAINS[keyof typeof CHAINS] | null>(null)),

		account: cachedStore(writable<`0x${string}` | null>()),


		async connect(force = false) {
			await disconnect(config)

			let account: Address | undefined
			let providerChain: ChainId | undefined

			const [reconnection] = await reconnect(config, { connectors: [injected()] })
			if (reconnection) {
				providerChain = reconnection.chainId as ChainId
				account = reconnection.accounts[0]
			} else {
				if (force) {
					try {
						const connection = await connect(config, { connector: injected() });
						providerChain = connection.chainId as ChainId
						account = connection.accounts[0]
					} catch (e) {
						console.warn(e)
					}
				}
			}

			if (account) ctx.account.set(account)

			let passedChain: ChainId | undefined
			const params = new URLSearchParams(window.location.search)
			if (params.has("chain")) {
				const chain = params.get("chain")
				passedChain = Object.values(CHAINS).find(c => c.tag === chain)?.id
			}

			if (passedChain) {
				// chain was passed with url, force switch
				if (passedChain !== ctx.chain.current?.id) await ctx.switchChain(passedChain)
				if (passedChain !== providerChain) await switchChain(config, { chainId: passedChain })
				// remove calleeChain from search params if chain was switched
				const searchParams = new URLSearchParams(window.location.search)
				searchParams.delete("chain")
				window.history.replaceState({}, "chain", '?' + searchParams.toString())
			} else {
				if (isChainSupported(providerChain)) {
					if (providerChain !== ctx.chain.current?.id) await ctx.switchChain(providerChain!, true)
				} else {
					// unsupported chain, use default chain
					if (ctx.chain.current === null) await ctx.switchChain(DEFAULT_CHAIN, true)
				}
			}
		},

		async disconnect() {
			await disconnect(config)
			ctx.account.set(null)
		},

		async ensureChain() {
			return await new Promise<NonNullable<typeof ctx.chain.current>>(res => {
				let resolved = false
				let unsub: () => void
				unsub = ctx.chain.subscribe(chain => {
					if (chain !== null) {
						unsub?.()
						resolved = true
						res(chain)
					}
				})
				if (resolved) unsub()
			})
		},

		async ensureConnected() {
			if (!ctx.account.current) {
				await ctx.connect()
			}

			const { chainId } = getAccount(config)
			if (!isChainSupported(chainId as ChainId)) {
				await switchChain(config, { chainId: ctx.chain.current?.id ?? DEFAULT_CHAIN })
			}

			return true;
		},

		async switchChain(id: ChainId, forceProviderSwitch = false) {
			if (forceProviderSwitch && ctx.account.current) {
				const { chainId } = getAccount(config)
				if (chainId !== id) await switchChain(config, { chainId: id })
			}

			if (ctx.chain.current?.id !== id) ctx.chain.set(CHAINS[id])
		},


		async getBalance() {
			await ctx.ensureConnected()

			const balance = await getBalance(config, {
				address: '0x4557B18E779944BFE9d78A672452331C186a9f48',
				chainId: ctx.chain.current!.id
			})

			return balance.value
		},


		price: cachedStore(consistentStore(readable<number>(0.0, (set) => {
			ctx.chain.subscribe(chain => {
				if (!chain) return
				readContract(config, {
					address: chain.contracts.pxls,
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
		}))),

		usdPrice: cachedStore(consistentStore(readable<number>(0.0, (set) => {
			ctx.chain.subscribe(chain => {
				if (!chain) return
				fetch(`https://api.redstone.finance/prices/?symbol=${chain.symbol.toUpperCase()}&provider=redstone&limit=1`)
					.then(r => r.json())
					.then(r => set(r?.[0]?.value))
					.catch(e => console.warn("Failed to fetch usd price: " + e))
			})
		}))),

		pixels: eagerStore(consistentStore(writable<PixelBalances>(new PixelBalances(), (set) => {
			ctx.chain.subscribe(() => set(new PixelBalances()))
			ctx.account.subscribe(() => set(new PixelBalances()))
			ctx.chain.subscribe(chain => {
				ctx.account.subscribe(async acc => {
					if (!acc) {
						set(new PixelBalances())
						return
					}
					if (!chain) return

					set(getPixels(acc, chain.tag)) // optimistically load pixels from storage 

					const storedLastBlock = BigInt(localStorage.getItem("pixels_last_block_" + chain + "_" + acc) ?? "0")

					// if out of sync fetch pixel balances from subgraph // TODO use correct endpoint
					const result = await subgraphExecute(AllPixelsByAccountDocument, { account: acc.toLowerCase(), block: storedLastBlock.toString() }, chain.tag)
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
			ctx.chain.subscribe(() => set([]))
			ctx.account.subscribe(() => set([]))
			ctx.chain.subscribe(chain => {
				ctx.account.subscribe(async acc => {
					if (!acc) return
					if (!chain) return

					const plates = (await readContract(config, {
						address: chain.contracts.plts,
						abi: magicPlatesABI,
						functionName: "platesOf",
						args: [acc],
						chainId: chain.id
					})).map(p => ({
						id: p.id,
						name: hexToString(p.name, { size: 16 }),
						pixels: bytesToPixels(p.pixels),
						delays: bytesToDelays(p.delays).map(arr => ({ idx: arr[0], delay: arr[1] })),
						owner: acc
					}));

					set(plates)
				})
			})
		})),

		trades: consistentStore(writable<P2PTrade[]>([], set => {
			ctx.chain.subscribe(() => set([]))
			ctx.account.subscribe(() => set([]))
			ctx.chain.subscribe((chain) => {
				ctx.account.subscribe(async acc => {
					if (!acc) {
						set([])
						return
					}
					if (!chain) return

					// TODO: use correct endpoint
					const result = await subgraphExecute(AllTradesForAccountDocument, { account: acc.toLowerCase() }, chain.tag)
					const trades: P2PTrade[] = (result.data?.trades ?? []).map((t: P2PTrade) => (
						{ ...t, pixels: bytesToPixelIds(t.pixels as unknown as Hex), price: BigInt(t.price) }
					))

					set(trades)
				})
			})
		})),


		async openTrade(pixels: PixelId[], receiver: Address, price: bigint, tradeType: number) {
			await ctx.ensureConnected()
			const chain = ctx.chain.current!

			const hash = await writeContract(config, {
				address: chain.contracts.pxls,
				abi: trdsCoreABI,
				functionName: "openTrade",
				args: [receiver, pixelIdsToBytes(pixels), price, tradeType],
				value: tradeType === 0 ? 0n : price,
				chainId: chain.id
			})

			const { status, blockNumber } = await waitForTransactionReceipt(config, { hash, confirmations: 2, chainId: chain.id })
			if (status == "reverted") throw "reverted"

			const openedEvents = await getContractEvents(getClient(config, { chainId: chain.id as 137 }), { // TODO: fix chain id type...
				address: chain.contracts.pxls,
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
					savePixels(updated, blockNumber, ctx.account.current!, ctx.chain.current!.tag)
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
			const chain = ctx.chain.current!

			const hash = await writeContract(config, {
				address: chain.contracts.pxls,
				abi: trdsCoreABI,
				functionName: "cancelTrade",
				args: [trade.id],
				chainId: chain.id
			});

			const { status, blockNumber } = await waitForTransactionReceipt(config, { hash, confirmations: 2, chainId: chain.id })
			if (status == "reverted") throw "reverted"

			if (trade.tradeType == 0) {
				// restore pixels
				ctx.pixels.update(c => {
					trade.pixels.forEach(id => c.increase(id))
					const updated = c.copy()
					savePixels(updated, blockNumber, ctx.account.current!, ctx.chain.current!.tag)
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
			const chain = ctx.chain.current!

			const hash = await writeContract(config, {
				address: chain.contracts.pxls,
				abi: trdsCoreABI,
				functionName: "closeTrade",
				args: [trade.id],
				value: trade.tradeType === 0 ? trade.price : 0n,
				chainId: chain.id
			});

			const { status, blockNumber } = await waitForTransactionReceipt(config, { hash, confirmations: 2, chainId: chain.id })
			if (status == "reverted") throw "reverted"

			ctx.pixels.update(c => {
				const isSell = trade.tradeType === 0
				trade.pixels.forEach(id => isSell ? c.increase(id) : c.decrease(id))
				const updated = c.copy()
				savePixels(updated, blockNumber, ctx.account.current!, ctx.chain.current!.tag)
				return updated
			})

			ctx.trades.update(c => {
				c.splice(c.findIndex(t => t.id === trade.id), 1)
				return [...c]
			})
		},

		async getTrade(id: Hex) {
			const chain = await ctx.ensureChain()

			const trade = await readContract(config, {
				address: chain.contracts.pxls,
				abi: trdsCoreABI,
				functionName: "getTrade",
				args: [id],
				chainId: chain.id
			});

			const pixelIds = bytesToPixelIds(trade.pixels)

			return pixelIds.length ? {
				...trade,
				id,
				pixels: pixelIds
			} as P2PTrade : null
		},

		async conjure(numPixels: number): Promise<[PixelId[], bigint]> {
			await ctx.ensureConnected()
			const chain = ctx.chain.current!

			const hash = await writeContract(config, {
				address: chain.contracts.pxls,
				abi: pxlsCoreABI,
				functionName: 'conjure',
				args: [BigInt(numPixels)],
				value: parseEther(ctx.price.current!.toString()) * BigInt(numPixels),
				chainId: chain.id
			})

			const { status, blockNumber } = await waitForTransactionReceipt(config, { hash, confirmations: 2, chainId: chain.id })
			if (status == "reverted") throw "reverted"

			const conjuredEvents = await getContractEvents(getClient(config, { chainId: chain.id as 137 }), { // TODO: fix chain id type...
				address: chain.contracts.pxls,
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
				savePixels(updated, blockNumber, ctx.account.current!, ctx.chain.current!.tag)
				return updated
			})

			const unexpectedFindEvents = await getContractEvents(getClient(config, { chainId: chain.id as 137 }), { // TODO: fix chain id type...
				address: chain.contracts.pxls,
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
			const chain = ctx.chain.current!

			const nameBytes = stringToHex(name, { size: 16 })
			const pixelBytes = pixelIdsToBytes(pixels)
			const delayBytes = "0x" + delays.map(delay => [delay.idx, delay.delay] as const).map(d => d.map(n => numberToHex(n, { size: 2 }).substring(2)).join("")).join("") as Hex

			const hash = await writeContract(config, {
				address: chain.contracts.pxls,
				abi: pxlsCoreABI,
				functionName: 'mint',
				args: [nameBytes, pixelBytes, delayBytes],
				chainId: chain.id
			})

			const { status, blockNumber } = await waitForTransactionReceipt(config, { hash, confirmations: 2, chainId: chain.id })
			if (status == "reverted") throw "reverted"

			ctx.pixels.update(c => {
				pixels.forEach(id => c.decrease(id))
				const updated = c.copy()
				savePixels(updated, blockNumber, ctx.account.current!, ctx.chain.current!.tag)
				return updated
			})

			const mintedEvents = await getContractEvents(getClient(config, { chainId: chain.id as 137 }), { // TODO: fix chain id type...
				address: chain.contracts.plts,
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
				address: chain.contracts.plts,
				abi: magicPlatesABI,
				functionName: "plateById",
				args: [tokenId],
				chainId: chain.id
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

		async shatter(tokenId: bigint) {
			await ctx.ensureConnected();
			const chain = ctx.chain.current!

			const hash = await writeContract(config, {
				address: chain.contracts.plts,
				abi: magicPlatesABI,
				functionName: "burn",
				args: [tokenId],
				chainId: chain.id
			})

			const { status, blockNumber } = await waitForTransactionReceipt(config, { hash, confirmations: 2, chainId: chain.id })
			if (status == "reverted") throw "reverted"

			const restoredEvents = await getContractEvents(getClient(config, { chainId: chain.id as 137 }), { // TODO: fix chain id type...
				address: chain.contracts.pxls,
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
				savePixels(updated, blockNumber, ctx.account.current!, ctx.chain.current!.tag)
				return updated
			})

			ctx.plates.update(c => {
				// remove shattered plate
				c.splice(c.findIndex(p => p.id === tokenId), 1)
				return [...c]
			})
		},

		async getPlate(tokenId: bigint) {
			const chain = await ctx.ensureChain()

			const [plateRes, ownerRes] = await readContracts(config, {
				contracts: [
					{
						address: chain.contracts.plts,
						abi: magicPlatesABI,
						functionName: "plateById",
						args: [tokenId],
						chainId: chain.id
					},
					{
						address: chain.contracts.plts,
						abi: magicPlatesABI,
						functionName: "ownerOf",
						args: [tokenId],
						chainId: chain.id
					}
				]
			})

			if (plateRes.error) throw "Failed"
			const rawPlate = plateRes.result

			return {
				id: rawPlate.id,
				name: hexToString(rawPlate.name, { size: 16 }),
				pixels: bytesToPixels(rawPlate.pixels),
				delays: bytesToDelays(rawPlate.delays).map(arr => ({ idx: arr[0], delay: arr[1] })),
				owner: ownerRes.result!
			} as Plate
		}
	}

	watchAccount(config, {
		onChange(curr, prev) {
			if (prev.chainId !== undefined && prev.chainId !== curr.chainId) {
				const id = curr.chainId as ChainId
				if (isChainSupported(id)) {
					if (ctx.chain.current?.id !== id) {
						ctx.switchChain(id)
					}
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

	ctx.chain.subscribe(c => console.log(c))

	// const passedChain = getPassedChain()
	// if (passedChain) ctx.switchChain(passedChain)

	ctx.connect()

	return ctx
}