import { viem } from 'hardhat'

import { decodeEventLog, parseEther } from 'viem'

import { deployPxls } from './MagicPixels'
import { deployPlts } from './MagicPlates'
import { openTrade } from './trade'
import { colors } from './colors'


export async function deploy () {
	const [acc1, acc2] = await viem.getWalletClients()
	const publicClient = await viem.getPublicClient()

	const pxlsAddress = await deployPxls() as `0x${string}`
	const pxSetters = await viem.getContractAt('PxlsSetters', pxlsAddress)
	console.log("Pixels: " + pxlsAddress)
	const pltsAddress = await deployPlts() as `0x${string}`
	const plts = await viem.getContractAt('MagicPlates', pltsAddress)
	console.log("Plates: " + pltsAddress)

	console.log("Deployed")

  await pxSetters.write.setMagicPlates([pltsAddress])
  await plts.write.setMagicPixels([pxlsAddress])

  await plts.write.setColors([colors])
	console.log("Colors set")

	// const pxls = await viem.getContractAt("PxlsCore", pxlsAddress)

  // const conjureTx = await pxls.write.conjure([64n], { value: parseEther("5.12") })
	// const conjureRcpt = await publicClient.waitForTransactionReceipt({ hash: conjureTx })
	// const conjured = decodeEventLog({ ...conjureRcpt.logs[conjureRcpt.logs.length > 1 ? 1: 0], abi: pxls.abi, eventName: "Conjured" })

  // const mintTx = await pxls.write.mint([conjured.args.pixels, []])
	// await publicClient.waitForTransactionReceipt({ hash: mintTx })

  console.log('Minted')
	
	await openTrade(acc1, pxlsAddress, "0x0000000000000000000000000000000000000000")
	const [id] = await openTrade(acc2, pxlsAddress, acc1.account.address)
	console.log('Test trade: ' + id)
}

deploy().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
