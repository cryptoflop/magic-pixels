import { configureChains, createConfig, connect, disconnect, InjectedConnector, readContract, writeContract, waitForTransaction, multicall } from "@wagmi/core";
import { publicProvider } from "@wagmi/core/providers/public";
import { readable, writable } from "svelte/store";
import { parseAbi, parseAbiItem, parseEther } from "viem";
import { goerli } from "viem/chains";
import { cachedStore, consistentStore } from "../helpers/reactivity-helpers";
import { BATCH_COST } from "../values";

export function createWeb3Ctx() {
    const { publicClient: clientDef, webSocketPublicClient } = configureChains(
        [goerli],
        [publicProvider()]
    );

    // PXLS
    // PLTS
    const PXLS = "0xC35632A3c400DB0bC1ee1855cdcec3c0008AD7E3"
    const PLTS = "0x9BD837e9e87114DA3FA682f805ecB8b8D6CFeae4"
    const USD = "0xB714d4Fd7f3B1af0D21587BD00f1667299553D41" // 0xb4e16d0168e52d35cacd2c6185b44281ec28c9dc

    const { publicClient } = createConfig({
        autoConnect: true,
        publicClient: clientDef,
        webSocketPublicClient,
    });

    const ctx = {
        account: cachedStore(writable<`0x${string}` | null>()),

        async connect() {
            const { account } = await connect({
                connector: new InjectedConnector(),
            });
            console.log(account)
            ctx.account.set(account)
        },

        async disconnect() {
            await disconnect()
            ctx.account.set(null)
        },

        usdPrice: consistentStore(readable<number>(1700, (set) => {
            readContract({
                address: USD,
                abi: [parseAbiItem("function getReserves() public view returns (uint112 _reserve0, uint112 _reserve1, uint32 _blockTimestampLast)")],
                functionName: "getReserves"
            }).then(r => {
                const price = (r[0] * (10n ** (18n-6n))) / r[1];
                console.log(price);
                set(Number(price));
            });
        })),

        pixels: consistentStore(writable<number[][]>([], (set) => {
            ctx.account.subscribe(async acc => {
                if (!acc) {
                    set([])
                    return
                }
                
                const pixels = (await readContract({
                    address: PXLS,
                    abi: [parseAbiItem("function pixelsOf(address addr) external view returns (uint8[][] memory)")],
                    functionName: "pixelsOf",
                    args: [acc],
                })) as number[][];
                
                set(pixels)
            })
        })),

        plates: consistentStore(writable<{ pixels: number[][], delays: number[][] }[]>([], (set) => {
            ctx.account.subscribe(async acc => {
                if (!acc) {
                    set([])
                    return
                }

                const numNfts = await readContract({
                    address: PLTS,
                    abi: [parseAbiItem("function balanceOf(address owner) view returns (uint256)")],
                    functionName: "balanceOf",
                    args: [acc],
                });

                const tokenIds = (await multicall({
                    contracts: Array(Number(numNfts)).fill(1).map(i => ({
                        address: PLTS,
                        abi: [parseAbiItem("function tokenOfOwnerByIndex(address owner, uint256 idx) view returns (uint256)")],
                        functionName: "tokenOfOwnerByIndex",
                        args: [acc, BigInt(i)],
                    })),
                })).filter(d => d.result).map(d => d.result!)

                const plates = (await multicall({
                    contracts: tokenIds.map(i => ({
                        address: PLTS,
                        abi: [parseAbiItem("function underlyingPixels(uint256 id) view returns (uint8[][], (uint256, uint16)[])")],
                        functionName: "underlyingPixels",
                        args: [i],
                    })),
                })).filter(d => d.result).map(d => d.result as unknown as [number[][], number[][]]).map(d => ({ pixels: d[0], delays: d[1] }))

                set(plates)
            })
        })),

        async conjure(batches: number) {
            const { hash } = await writeContract({
                address: PXLS,
                abi: [parseAbiItem('function conjure(uint256 batches) external payable')],
                functionName: 'conjure',
                args: [BigInt(batches)],
                value: parseEther(BATCH_COST.toString()) * BigInt(batches)
            })

            const { status, blockNumber } = await waitForTransaction({ hash })
            if (status == "reverted") throw "reverted"

            const ethFoundLogs = await publicClient.getLogs({
                address: PXLS,
                event: parseAbiItem('event EthFound(address indexed to, uint256 amount)'),
                args: {
                    to: ctx.account.current
                },
                fromBlock: blockNumber,
                toBlock: blockNumber
            })

            const ethFound = ethFoundLogs[0]?.args.amount ?? BigInt(0)

            const conjuredLogs = await publicClient.getLogs({
                address: PXLS,
                event: parseAbiItem('event Conjured(address indexed to, uint8[][] pixels)'),
                args: {
                    to: ctx.account.current
                },
                fromBlock: blockNumber,
                toBlock: blockNumber
            })

            const pixels = conjuredLogs[0].args.pixels! as number[][]
            ctx.pixels.update(c => c.concat(pixels))

            return [pixels, ethFound] as const
        },

        async mint(indices: number[], delays: number[][]) {
            const { hash } = await writeContract({
                address: PXLS,
                abi: [parseAbiItem('function mint(uint256[] calldata indices, uint256[] calldata delays) external')],
                functionName: 'mint',
                args: [indices.map(i => BigInt(i)), delays.flat().map(i => BigInt(i))]
            })

            const { status, blockNumber } = await waitForTransaction({ hash })
            if (status == "reverted") throw "reverted"

            const mintedLogs = await publicClient.getLogs({
                address: PLTS,
                event: parseAbiItem('event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)'),
                args: {
                    from: '0x0000000000000000000000000000000000000000',
                    to: ctx.account.current
                },
                fromBlock: blockNumber,
                toBlock: blockNumber
            })

            ctx.pixels.update(c => {
                const plate: number[][] = []
                
                const m = [...c]
                const indicesSorted = indices.sort((a, b) => b - a)
                // pop used pixels
                for (let i = 0; i < indicesSorted.length; i++) {
                    const idx = indicesSorted[i];
                    const len = m.length - 1;
                    if (idx < len) {
                        m[idx] = m[len];
                        plate.push(m[idx])
                    }
                    m.pop();
                }

                ctx.plates.update(c => c.concat([{ pixels: plate, delays }]))

                return m
            })

            return mintedLogs[0].args.tokenId!
        },

        async burn() {
            // TODO 
        }
    }

    ctx.connect().then(() => ctx.pixels.subscribe(() => {})()) // connect and force sub pixels

    return ctx
}