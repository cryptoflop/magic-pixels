import { configureChains, createConfig, connect, disconnect, InjectedConnector, readContract, writeContract, waitForTransaction, getPublicClient } from "@wagmi/core";
import { jsonRpcProvider } from "@wagmi/core/providers/jsonRpc";
import { parseAbiItem, parseEther, type Hex, type Address } from "viem";
import { readable, writable } from "svelte/store";
import { mantleTestnet } from "viem/chains";
import { cachedStore, consistentStore } from "../helpers/reactivity-helpers";
import { bytesToPixelIds, decodePixel } from "../../contracts/scripts/libraries/pixel-parser"
import { NULL_ADDR, PIXEL_PRICE } from "../values";

import { pxlsCoreABI, pxlsNetherABI, magicPlatesABI } from "../../contracts/generated";

import { execute, AllPixelsByAccountDocument, AccountLastBlockDocument } from "../../subgraph/.graphclient"
import PixelBalances from "../helpers/pixel-balances";

function savePixels(balances: PixelBalances, blockNumber: bigint, addr: Address) {
	localStorage.setItem("pixels_" + addr, balances.toString())
	localStorage.setItem("pixels_last_block_" + addr, blockNumber.toString())
}

function getPixels(addr: Address) {
	return new PixelBalances(new Map(JSON.parse(localStorage.getItem("pixels_" + addr) ?? "[]")))
}

export function createWeb3Ctx() {
	const PXLS = import.meta.env.VITE_PXLS
	const PLTS = import.meta.env.VITE_PLTS
	const USDC = import.meta.env.VITE_USDC

	const ctx = {
		account: cachedStore(writable<`0x${string}` | null>()),

		async connect() {
			const { chains, publicClient: publicClientGetter } = configureChains(
				[mantleTestnet],
				[jsonRpcProvider({ rpc: (_) => ({ http: import.meta.env.VITE_RPC_URL }), })],
			)

			const { connectors } = createConfig({
				autoConnect: true,
				connectors: [new InjectedConnector({ chains })],
				publicClient: publicClientGetter
			})

			const { account } = await connect({ connector: connectors[0]! });
			console.log(account)
			ctx.account.set(account)
		},

		async disconnect() {
			await disconnect()
			ctx.account.set(null)
		},

		usdPrice: consistentStore(readable<number>(0.378, (set) => {
			readContract({
				address: USDC,
				abi: [parseAbiItem("function getPrice(bytes32 id) public view returns((int64, uint64, int32, uint))")],
				functionName: "getPrice",
				args: [import.meta.env.VITE_MNT_UDC_ID]
			}).then(r => {
				const mntUsdPrice = Number(r[0]) * Math.pow(10, -8)
				set(mntUsdPrice);
			});
		})),

		pixels: consistentStore(writable<PixelBalances>(new PixelBalances(), (set) => {
			ctx.account.subscribe(async acc => {
				if (!acc) {
					set(new PixelBalances())
					return
				}

				set(getPixels(acc)) // optimistically load pixels from storage 

				const lastBlockRes = await execute(AccountLastBlockDocument, { account: acc.toLowerCase() })
				const lastBlock = BigInt(lastBlockRes.data?.account?.last_block ?? "0")

				const storedLastBlock = BigInt(localStorage.getItem("pixels_last_block_" + acc) ?? "0")

				if (lastBlock > storedLastBlock) {
					// if out of sync fetch pixel balances from subgraph
					const result = await execute(AllPixelsByAccountDocument, { account: acc.toLowerCase(), first: 18050, skip: 0 })
					const data: { pixel: Hex, amount: string }[] = result.data?.account?.balances ?? []
					const pixelBalances = data.reduce((prev, curr) => {
						prev.set(curr.pixel, Number(curr.amount))
						return prev
					}, new PixelBalances())
					set(pixelBalances)
					savePixels(pixelBalances, lastBlock, acc)
				}
			})
		})),

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
				})).map(p => ({ id: p.id, pixels: p.pixels.map(pxl => pxl.map(i => i)), delays: p.delays.map(d => ({ idx: d.idx, delay: d.delay })) }));

				set(plates)
			})
		})),

		trades: consistentStore(writable<P2PTrade[]>([], set => {
			ctx.account.subscribe(async acc => {
				if (!acc) {
					set([])
					return
				}

				// TODO: 

				set([])
			})
		})),

		async getTrade(id: `0x${string}`) {
			const trade = await readContract({
				address: PXLS,
				abi: [parseAbiItem("function getTrade(bytes32 id) view returns((address, address, uint8[][], uint256))")],
				functionName: "getTrade",
				args: [id]
			});
			return trade[2].length ? {
				id,
				seller: trade[0],
				buyer: trade[1],
				pixels: trade[2].map(p => p.map(pi => pi)),
				price: trade[3]
			} as P2PTrade : null
		},

		async openTrade(pixels: number[][], price: bigint, receiver: string, isSell: boolean) {
			const { hash } = await writeContract({
				address: PXLS,
				abi: [parseAbiItem("function openTrade(address, uint8[][], uint256, bool) external payable")],
				functionName: "openTrade",
				args: [receiver as `0x${string}`, pixels, price, isSell],
				value: price
			});

			const { status, blockNumber } = await waitForTransaction({ hash })
			if (status == "reverted") throw "reverted"

			const logs = await getPublicClient().getLogs({
				address: PXLS,
				event: parseAbiItem('event TradeOpened(address indexed creator, bytes32 id)'),
				args: {
					creator: ctx.account.current
				},
				fromBlock: blockNumber,
				toBlock: blockNumber
			})

			const tradeId = logs[0]!.args.id!

			ctx.trades.update(curr => {
				curr.push({
					id: tradeId,
					seller: isSell ? ctx.account.current! : receiver,
					buyer: isSell ? receiver : ctx.account.current!,
					pixels,
					price
				})
				return curr
			})

			return tradeId
		},

		async closeTrade(trade: P2PTrade) {
			// const ptx = await prepareWriteContract({
			// 	address: PXLS,
			// 	abi: [parseAbiItem("function closeTrade(bytes32 id) external payable")],
			// 	functionName: "closeTrade",
			// 	args: [trade.id],
			// 	value: trade.price
			// })

			const { hash } = await writeContract({
				address: PXLS,
				abi: [parseAbiItem("function closeTrade(bytes32 id) external payable")],
				functionName: "closeTrade",
				args: [trade.id],
				value: trade.price
			});

			const { status } = await waitForTransaction({ hash })
			if (status == "reverted") throw "reverted"

			// await walletClient.writeContract({
			// 	address: PXLS,
			// 	abi: [parseAbiItem("function closeTrade(bytes32 id) external payable")],
			// 	functionName: "closeTrade",
			// 	args: [trade.id],
			// 	value: trade.price,
			// 	chain: base,
			// 	gas: 10000000n
			// })
		},

		async conjure(numPixels: number): Promise<[PixelId[], bigint]> {
			const { hash } = await writeContract({
				address: PXLS,
				abi: pxlsCoreABI,
				functionName: 'conjure',
				args: [BigInt(numPixels)],
				value: parseEther(PIXEL_PRICE.toString()) * BigInt(numPixels)
			})

			const { status, blockNumber } = await waitForTransaction({ hash, confirmations: import.meta.env.DEV ? 1 : 2 })
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
					to: ctx.account.current
				},
				fromBlock: blockNumber,
				toBlock: blockNumber
			})

			const ethFound = unexpectedFindEvents[0]?.args.amount ?? BigInt(0)

			return [pixelIds, ethFound]
		},

		async mint(pixels: PixelId[], delays: Delay[]) {
			const { hash } = await writeContract({
				address: PXLS,
				abi: pxlsCoreABI,
				functionName: 'mint',
				args: [pixels.map(id => decodePixel(id)), delays.map(delay => [delay.idx, delay.delay] as const)]
			})

			const { status, blockNumber } = await waitForTransaction({ hash })
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
					from: NULL_ADDR,
					to: ctx.account.current!
				},
				fromBlock: blockNumber,
				toBlock: blockNumber
			})

			const tokenId = mintedEvents[0].args.tokenId!

			const plate = (await readContract({
				address: PLTS,
				abi: magicPlatesABI,
				functionName: "plateById",
				args: [tokenId],
			}))

			ctx.plates.update(c => c.concat([{
				id: plate.id,
				pixels: plate.pixels.map(pxl => pxl.map(i => i)),
				delays: plate.delays.map(d => ({ idx: d.idx, delay: d.delay }))
			}]))

			return tokenId
		},

		async burn() {
			// TODO
		}
	}

	ctx.connect().then(() => ctx.pixels.subscribe(() => { })()) // connect and force sub pixels

	return ctx
}