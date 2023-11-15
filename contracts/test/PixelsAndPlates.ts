import { expect } from 'chai'

import { ethers, viem } from 'hardhat'
import { decodeEventLog, parseEther } from 'viem'
import { bytesToPixels } from '../scripts/libraries/pixel-parser'

import { deployPxls } from '../scripts/MagicPixels'
import { deployPlts } from '../scripts/MagicPlates'
import { colors } from '../scripts/colors'

describe('PixelsAndPlates', function () {
	let publicClient: Awaited<ReturnType<typeof viem.getPublicClient>>

	let pxlsAddress: `0x${string}`
	let pltsAddress: `0x${string}`

	before(async function () {
		publicClient = await viem.getPublicClient()

		pxlsAddress = await deployPxls()
		pltsAddress = await deployPlts()

		const pxls = await viem.getContractAt("PxlsSetters", pxlsAddress)
		await pxls.write.setMagicPlates([pltsAddress])
		const plts = await viem.getContractAt("MagicPlates", pltsAddress)
		await plts.write.setMagicPixels([pxlsAddress])

		await plts.write.setColors([colors])
	})

	it('Should conjure, mint, and check the plate', async function () {
		const [acc] = await viem.getWalletClients()
		const pxls = await viem.getContractAt("PxlsCore", pxlsAddress)
		const plts = await viem.getContractAt("MagicPlates", pltsAddress)

		const price = await (await viem.getContractAt("PxlsCommon", pxlsAddress)).read.price()

		const conjureTx = await pxls.write.conjure([256n], { value: price * 256n })
		const conjureRcpt = await publicClient.waitForTransactionReceipt({ hash: conjureTx })
		const conjured = decodeEventLog({ ...conjureRcpt.logs[0], abi: pxls.abi, eventName: "Conjured" })

		const pixels = bytesToPixels(conjured.args.pixels)
		const delays = Array(2).fill(1)
			.map((_, i) => pixels.findIndex((pxl, j) => pxl.length > 1 && (i > 0 ? (j > 100) : true)))
			.map(idx => [idx, Math.round(Math.random() * (199 - 0) + 0)])

		await pxls.write.mint([conjured.args.pixels, delays])

		const svgDataURI = await (await ethers.getContractAt("MagicPlates", pltsAddress)).tokenURI(0, { gasLimit: 999999999999999999n }) // viem fails in this case, ethers doesn't...
		expect(svgDataURI, "invalid svg data uri").includes("data:image/svg+xml")
		// TODO: check if pixels are the correct color...

		const { pixels: underlyingPixels, delays: underlyingDelays } = await plts.read.plateById([0n])
		expect(pixels.length, "conjured / underlying pixel length mismatch.").eq(underlyingPixels.length)

		expect(underlyingDelays.map(d => [d.idx, d.delay]).every((d, i) => d.every((v, j) => v === delays[i][j])), "delays do not match").to.be.true

		// console.log(svgDataURI, underlyingDelays)

		let allPixelsMatchInOrder = true
		for (let i = 0; i < underlyingPixels.length; i++) {
			const p = pixels[i]
			const up = underlyingPixels[i]

			for (let j = 0; j < p.length; j++) {
				if (p[j] !== up[j]) {
					allPixelsMatchInOrder = false;
					break;
				}
			}
		}
		expect(allPixelsMatchInOrder, "conjured/minted pixels don't match underlying.").to.be.true

		const plates = await plts.read.platesOf([acc.account.address])

		expect(plates[0].pixels.length, "plateById/platesOf pixels length mismatch.").eq(underlyingPixels.length)

		const burnTx = await plts.write.burn([0n])
		const burnRcpt = await publicClient.waitForTransactionReceipt({ hash: burnTx })
		const restored = decodeEventLog({ ...burnRcpt.logs[1], abi: pxls.abi, eventName: "Conjured" })
		
		expect(bytesToPixels(restored.args.pixels).every((p, i) => p.every((v, j) => v === pixels[i][j])), "").to.be.true
	})

	it('Should mint 8x8 plate', async function () {
		const pxls = await viem.getContractAt("PxlsCore", pxlsAddress)

		const price = await (await viem.getContractAt("PxlsCommon", pxlsAddress)).read.price()

		const conjureTx = await pxls.write.conjure([64n], { value: price * 64n })
		const conjureRcpt = await publicClient.waitForTransactionReceipt({ hash: conjureTx })
		const conjured = decodeEventLog({ ...conjureRcpt.logs[0], abi: pxls.abi, eventName: "Conjured" })

		await pxls.write.mint([conjured.args.pixels, []])
	})

})