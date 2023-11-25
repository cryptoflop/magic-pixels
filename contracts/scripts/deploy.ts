import { ethers, viem } from 'hardhat'

import { Hex, decodeEventLog, numberToHex, parseEther, stringToHex } from 'viem'

import { deployPxls } from './MagicPixels'
import { deployPlts } from './MagicPlates'
import { openTrade } from './trade'
import { colors } from './colors'
import { bytesToPixels } from './libraries/pixel-parser'


export async function deploy () {
	// const [acc1, acc2] = await viem.getWalletClients()
	// const publicClient = await viem.getPublicClient()

	const pxlsAddress = "0x2d40d461556a9f198cda1377e61ad4d60a866e44" // await deployPxls() as `0x${string}`
	console.log("Pixels: " + pxlsAddress)
	const pltsAddress = await deployPlts() as `0x${string}`
	const plts = await viem.getContractAt('MagicPlates', pltsAddress)
	console.log("Plates: " + pltsAddress)

	console.log("Deployed")

  await (await viem.getContractAt("PxlsSetters", pxlsAddress)).write.setMagicPlates([pltsAddress])

  await plts.write.setMagicPixels([pxlsAddress])
  await plts.write.setColors([colors])
	console.log("Colors set")

	// const pxls = await viem.getContractAt("PxlsMain", pxlsAddress)

	// const price = await (await viem.getContractAt("PxlsCommon", pxlsAddress)).read.price()

  // const conjureTx = await pxls.write.conjure([(8n * 8n)], { value: price * (24n * 24n) })
	// const conjureRcpt = await publicClient.waitForTransactionReceipt({ hash: conjureTx })
	// const conjured = decodeEventLog({ ...conjureRcpt.logs[conjureRcpt.logs.length > 1 ? 1: 0], abi: pxls.abi, eventName: "Conjured" })

	// const pixels = bytesToPixels(conjured.args.pixels)

	// const delayBytes = "0x" + Array(2).fill(1)
	// 		.map((_, i) => pixels.findIndex((pxl, j) => pxl.length > 1 && (i > 0 ? (j > 10) : true)))
	// 		.map(idx => [idx, Math.round(Math.random() * (199 - 0) + 0)]).map(d => d.map(n => numberToHex(n, { size: 2 }).substring(2)).join(""))
	// 		.join("") as Hex

  // const mintTx = await pxls.write.mint([stringToHex("Testio test", { size: 16 }), conjured.args.pixels, delayBytes], { gas: 60000000n })
	// await publicClient.waitForTransactionReceipt({ hash: mintTx })

	// await plts.write.burn([0n])


	// await openTrade(acc1, pxlsAddress, "0x0000000000000000000000000000000000000000")
	// const [id] = await openTrade(acc2, pxlsAddress, acc1.account.address)
	// console.log('Test trade: ' + id)
}

deploy().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
