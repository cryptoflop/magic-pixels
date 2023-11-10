import { viem } from 'hardhat'
import { decodeEventLog, parseEther } from 'viem'
import { bytesToPixelIds } from './libraries/pixel-parser'

export async function openTrade(acc: Awaited<ReturnType<typeof viem.getWalletClients>>[0], pxlsAddress: `0x${string}`, receiver: `0x${string}`) {
	const publicClient = await viem.getPublicClient()

	const pxls = await viem.getContractAt('PxlsCore', pxlsAddress, { walletClient: acc })
	const ah = await viem.getContractAt('AuctionHouse', pxlsAddress, { walletClient: acc })

	const conjureTx = await pxls.write.conjure([2n], { value: parseEther("0.16") })
	const conjureRcpt = await publicClient.waitForTransactionReceipt({ hash: conjureTx })
	const conjured = decodeEventLog({ ...conjureRcpt.logs[0], abi: pxls.abi, eventName: "Conjured" })

	const tradeTx = await ah.write.openTrade([receiver, bytesToPixelIds(conjured.args.pixels), 0n, true])
	const tradeRcpt = await publicClient.waitForTransactionReceipt({ hash: tradeTx })
	const tradeOpened = decodeEventLog({ ...tradeRcpt.logs[0], abi: ah.abi, eventName: "TradeOpened" })

	return tradeOpened.args.id
}

if (require.main === module) {
	(async () => {
		const [acc] = await viem.getWalletClients()

		// TODO: use pixeladdress from process args
		openTrade(acc, "0x123", "0x0000000000000000000000000000000000000000")
			.then(() => process.exit(0))
			.catch(error => {
				console.error(error)
				process.exit(1)
			})
	})()
}