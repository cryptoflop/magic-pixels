import { expect } from 'chai'

import { viem } from 'hardhat'
import { decodeEventLog, parseEther } from 'viem'
import { bytesToPixels, pixelsToBytes } from '../scripts/libraries/pixel-parser'

import { deployPxls } from '../scripts/MagicPixels'

describe('PxlsCore', function () {
	let publicClient: Awaited<ReturnType<typeof viem.getPublicClient>>

	let pxlsAddress: `0x${string}`

	before(async function() {
		publicClient = await viem.getPublicClient()
		pxlsAddress = await deployPxls()
	})

  it('Should deploy', async function () {
		const pxls = await viem.getContractAt("PxlsCore", pxlsAddress)
    expect(pxls).not.false
  })

	it('Should set plates address', async function () {
		const pxls = await viem.getContractAt("PxlsSetters", pxlsAddress)
		await pxls.write.setMagicPlates(["0x4Cd569dD59F84b83cbd97EC87FCF050d612f99E3"])
	})

	it('Should conjure 256 pixels', async function () {
		const pxls = await viem.getContractAt("PxlsCore", pxlsAddress)

		const conjureTx = await pxls.write.conjure([256n], { value: parseEther("21") })
		const conjureRcpt = await publicClient.waitForTransactionReceipt({ hash: conjureTx })
		const conjured = decodeEventLog({ ...conjureRcpt.logs[0], abi: pxls.abi, eventName: "Conjured" })

		const pixels = bytesToPixels(conjured.args.pixels)
		expect(pixels.length).eq(256, "Conjured pixels length mismatch.")
		const bytes = pixelsToBytes(pixels)
		expect(bytes).eq(conjured.args.pixels, "Pixels encoding mismatch.")

		// TODO: maybe check actual pixels...
	})

})