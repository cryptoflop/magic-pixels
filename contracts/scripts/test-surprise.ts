import { viem } from 'hardhat'

import { decodeEventLog, formatEther, parseEther } from 'viem'

import { deployPxls } from './MagicPixels'

export async function testPixels() {
	const publicClient = await viem.getPublicClient()

	const pxlsAddress = await deployPxls() as `0x${string}`

	const pxls = await viem.getContractAt("PxlsCore", pxlsAddress)
	const nether = await viem.getContractAt("PxlsNether", pxlsAddress)

	let i = 1
	while (true) {
		const conjureTx = await pxls.write.conjure([256n], { value: parseEther("20.5") })
		const conjureRcpt = await publicClient.waitForTransactionReceipt({ hash: conjureTx })
		if (conjureRcpt.logs.length > 1) {
			const surprise = decodeEventLog({ ...conjureRcpt.logs[0], abi: nether.abi, eventName: "UnexpectedFind" })
			console.log("Found eth: " + formatEther(surprise.args.amount))
		}
		console.log(i)
		i++
	}
}

testPixels().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
