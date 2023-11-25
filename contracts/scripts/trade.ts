import { viem } from 'hardhat'
import { decodeEventLog, parseEther } from 'viem'
import { deployPxls } from './MagicPixels'

export async function openTrade(acc: Awaited<ReturnType<typeof viem.getWalletClients>>[0], pxlsAddress: `0x${string}`, receiver: `0x${string}`) {
	const publicClient = await viem.getPublicClient()

	const pxls = await viem.getContractAt('PxlsMain', pxlsAddress, { walletClient: acc })
	const trds = await viem.getContractAt('TrdsCore', pxlsAddress, { walletClient: acc })

	const price = await (await viem.getContractAt("PxlsCommon", pxlsAddress)).read.price()

	const conjureTx = await pxls.write.conjure([2n], { value: price * 2n })
	const conjureRcpt = await publicClient.waitForTransactionReceipt({ hash: conjureTx })
	const conjured = decodeEventLog({ ...conjureRcpt.logs[0], abi: pxls.abi, eventName: "Conjured" })

	const tradeTx = await trds.write.openTrade([receiver, conjured.args.pixels, parseEther("1"), 0])
	const tradeRcpt = await publicClient.waitForTransactionReceipt({ hash: tradeTx })
	const tradeOpened = decodeEventLog({ ...tradeRcpt.logs[1], abi: trds.abi, eventName: "TradeOpened" })

	return [tradeOpened.args.id, conjured.args.pixels]
}

if (require.main === module) {
	(async () => {
		const [acc] = await viem.getWalletClients()

		const pxlsAddress = await deployPxls()

		const [id] = await openTrade(acc, pxlsAddress, "0x0000000000000000000000000000000000000000")

		console.log(id)
	})()
}