import { configureChains, createConfig, connect, disconnect, InjectedConnector, readContract, writeContract, waitForTransaction, getPublicClient, switchNetwork, getNetwork, watchAccount, fetchBalance } from "@wagmi/core";
import { parseEther, type Hex, type Address, formatEther, stringToHex, hexToString, zeroAddress, numberToHex } from "viem";
import { readable, writable } from "svelte/store";
import { arbitrum, polygon } from "viem/chains";
import { cachedStore, consistentStore, eagerStore } from "../helpers/reactivity-helpers";
import { bytesToDelays, bytesToPixelIds, bytesToPixels, pixelIdsToBytes } from "../../contracts/scripts/libraries/pixel-parser"
import { pxlsCoreABI, pxlsNetherABI, magicPlatesABI, trdsCoreABI, pxlsCommonABI } from "../../contracts/generated";

import { execute, AllPixelsByAccountDocument, AllTradesForAccountDocument } from "../../subgraph/.graphclient"
import PixelBalances from "../helpers/pixel-balances";
import { jsonRpcProvider } from "@wagmi/core/providers/jsonRpc";

function savePixels(balances: PixelBalances, blockNumber: bigint, addr: Address) {
	localStorage.setItem("pixels_" + addr, balances.toString())
	localStorage.setItem("pixels_last_block_" + addr, blockNumber.toString())
}

function getPixels(addr: Address) {
	return PixelBalances.fromString(localStorage.getItem("pixels_" + addr) ?? "")
}

export function createWeb3Ctx() {
	const PXLS = import.meta.env.VITE_PXLS
	const PLTS = import.meta.env.VITE_PLTS

	const { chains, publicClient: publicClientGetter } = configureChains(
		[polygon],
		[jsonRpcProvider({
			rpc: (_) => ({
				http: import.meta.env.VITE_RPC,
			}),
		}),],
	)

	createConfig({
		publicClient: publicClientGetter
	})

	const ctx = {
		account: cachedStore(writable<`0x${string}` | null>()),

		async connect() {
			await disconnect()
			const { account } = await connect({ connector: new InjectedConnector({ chains }) });
			if (getNetwork()?.chain?.id !== polygon.id) {
				await switchNetwork({ chainId: chains[0].id })
			}
			const unwatch = watchAccount(a => {
				if (a.address !== account) {
					unwatch()
					ctx.disconnect()
				}
			})
			console.log(account)
			ctx.account.set(account)
		},

		async disconnect() {
			await disconnect()
			ctx.account.set(null)
		},

		async getBalance() {
			return await fetchBalance({ address: ctx.account.current! })
		},

		async ensureConnected() {
			if (!ctx.account.current) {
				await ctx.connect()
			}
			return true;
		},

		price: eagerStore(cachedStore(consistentStore(readable<number>(0.0, (set) => {
			readContract({
				address: PXLS,
				abi: pxlsCommonABI,
				functionName: "price"
			}).then(r => {
				set(Number(formatEther(r)))
			})
		})))),

		usdPrice: eagerStore(cachedStore(consistentStore(readable<number>(0.0, (set) => {
			fetch(`https://api.redstone.finance/prices/?symbol=${(import.meta.env.VITE_VALUE_SYMBOL as string).toUpperCase()}&provider=redstone&limit=1`).then(r => {
				r.json().then(v => set(v?.[0]?.value))
			})
		})))),

		pixels: eagerStore(consistentStore(writable<PixelBalances>(new PixelBalances(), (set) => {
			ctx.account.subscribe(async acc => {
				if (!acc) {
					set(new PixelBalances())
					return
				}

				set(getPixels(acc)) // optimistically load pixels from storage 

				const storedLastBlock = BigInt(localStorage.getItem("pixels_last_block_" + acc) ?? "0")

				// if out of sync fetch pixel balances from subgraph
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
					savePixels(pixelBalances, BigInt(data.last_block), acc)
				}
			})
		}))),

		plates: consistentStore(writable<Plate[]>([], (set) => {
			ctx.account.subscribe(async acc => {
				if (!acc) {
					set([])
					return
				}

				const plates = (await readContract({
					address: PLTS,
					abi: magicPlatesABI,
					functionName: "platesOf",
					args: [acc],
				})).map(p => ({
					id: p.id,
					name: hexToString(p.name, { size: 16 }),
					pixels: bytesToPixels(p.pixels),
					delays: bytesToDelays(p.delays).map(arr => ({ idx: arr[0], delay: arr[1] }))
				}));

				set(plates)
			})
		})),

		trades: consistentStore(writable<P2PTrade[]>([], set => {
			ctx.account.subscribe(async acc => {
				if (!acc) {
					set([])
					return
				}

				const result = await execute(AllTradesForAccountDocument, { account: acc.toLowerCase() })
				const trades: P2PTrade[] = (result.data?.trades ?? []).map((t: P2PTrade) => (
					{ ...t, pixels: bytesToPixelIds(t.pixels as unknown as Hex), price: BigInt(t.price) }
				))

				set(trades)
			})
		})),

		async openTrade(pixels: PixelId[], receiver: Address, price: bigint, tradeType: number) {
			await ctx.ensureConnected();

			const { hash } = await writeContract({
				address: PXLS,
				abi: trdsCoreABI,
				functionName: "openTrade",
				args: [receiver, pixelIdsToBytes(pixels), price, tradeType],
				value: tradeType === 0 ? 0n : price
			});

			const { status, blockNumber } = await waitForTransaction({ hash, confirmations: 2 })
			if (status == "reverted") throw "reverted"

			const openedEvents = await getPublicClient().getContractEvents({
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
					savePixels(updated, blockNumber, ctx.account.current!)
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

			const { hash } = await writeContract({
				address: PXLS,
				abi: trdsCoreABI,
				functionName: "cancelTrade",
				args: [trade.id]
			});

			const { status, blockNumber } = await waitForTransaction({ hash, confirmations: 2 })
			if (status == "reverted") throw "reverted"

			if (trade.tradeType == 0) {
				// restore pixels
				ctx.pixels.update(c => {
					trade.pixels.forEach(id => c.increase(id))
					const updated = c.copy()
					savePixels(updated, blockNumber, ctx.account.current!)
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

			const { hash } = await writeContract({
				address: PXLS,
				abi: trdsCoreABI,
				functionName: "closeTrade",
				args: [trade.id],
				value: trade.tradeType === 0 ? trade.price : 0n
			});

			const { status, blockNumber } = await waitForTransaction({ hash, confirmations: 2 })
			if (status == "reverted") throw "reverted"

			ctx.pixels.update(c => {
				const isSell = trade.tradeType === 0
				trade.pixels.forEach(id => isSell ? c.increase(id) : c.decrease(id))
				const updated = c.copy()
				savePixels(updated, blockNumber, ctx.account.current!)
				return updated
			})

			ctx.trades.update(c => {
				c.splice(c.findIndex(t => t.id === trade.id), 1)
				return [...c]
			})
		},

		async getTrade(id: Hex) {
			const trade = await readContract({
				address: PXLS,
				abi: trdsCoreABI,
				functionName: "getTrade",
				args: [id]
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

			const { hash } = await writeContract({
				address: PXLS,
				abi: pxlsCoreABI,
				functionName: 'conjure',
				args: [BigInt(numPixels)],
				value: parseEther(ctx.price.current!.toString()) * BigInt(numPixels)
			})

			const { status, blockNumber } = await waitForTransaction({ hash, confirmations: 2 })
			if (status == "reverted") throw "reverted"

			const conjuredEvents = await getPublicClient().getContractEvents({
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
				savePixels(updated, blockNumber, ctx.account.current!)
				return updated
			})

			const unexpectedFindEvents = await getPublicClient().getContractEvents({
				address: PXLS,
				abi: pxlsNetherABI,
				eventName: "UnexpectedFind",
				args: {
					to: ctx.account.current!
				},
				fromBlock: blockNumber,
				toBlock: blockNumber
			})

			const ethFound = unexpectedFindEvents[0]?.args.amount ?? BigInt(0)

			return [pixelIds, ethFound]
		},

		async mint(name: string, pixels: PixelId[], delays: Delay[]) {
			await ctx.ensureConnected();

			const nameBytes = stringToHex(name, { size: 16 })
			const pixelBytes = pixelIdsToBytes(pixels)
			const delayBytes = "0x" + delays.map(delay => [delay.idx, delay.delay] as const).map(d => d.map(n => numberToHex(n, { size: 2 }).substring(2)).join("")).join("") as Hex

			const { hash } = await writeContract({
				address: PXLS,
				abi: pxlsCoreABI,
				functionName: 'mint',
				args: [nameBytes, pixelBytes, delayBytes]
			})

			const { status, blockNumber } = await waitForTransaction({ hash, confirmations: 2 })
			if (status == "reverted") throw "reverted"

			ctx.pixels.update(c => {
				pixels.forEach(id => c.decrease(id))
				const updated = c.copy()
				savePixels(updated, blockNumber, ctx.account.current!)
				return updated
			})

			const mintedEvents = await getPublicClient().getContractEvents({
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

			const rawPlate = (await readContract({
				address: PLTS,
				abi: magicPlatesABI,
				functionName: "plateById",
				args: [tokenId],
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
			const rawPlate = await readContract({
				address: PLTS,
				abi: magicPlatesABI,
				functionName: "plateById",
				args: [tokenId],
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

			const { hash } = await writeContract({
				address: PLTS,
				abi: magicPlatesABI,
				functionName: "burn",
				args: [tokenId],
			})

			const { status, blockNumber } = await waitForTransaction({ hash, confirmations: 2 })
			if (status == "reverted") throw "reverted"

			const restoredEvents = await getPublicClient().getContractEvents({
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
				savePixels(updated, blockNumber, ctx.account.current!)
				return updated
			})

			ctx.plates.update(c => {
				// remove shattered plate
				c.splice(c.findIndex(p => p.id === tokenId), 1)
				return [...c]
			})
		}
	}

	ctx.connect()

	return ctx
}