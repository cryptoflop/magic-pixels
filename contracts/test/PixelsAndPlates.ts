import { expect } from 'chai'

import { ethers, viem } from 'hardhat'
import { Hex, decodeEventLog, hexToString, numberToHex, stringToHex } from 'viem'
import { bytesToPixels } from '../scripts/libraries/pixel-parser'

import { deployPxls } from '../scripts/MagicPixels'
import { deployPlts } from '../scripts/MagicPlates'
import { colors } from '../scripts/colors'

import { parse as parseSvg } from 'svg-parser';

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
		const delayBytes = "0x" + delays.map(d => d.map(n => numberToHex(n, { size: 2 }).substring(2)).join(""))
		.join("") as Hex

		await pxls.write.mint([stringToHex("Test", { size: 16 }), conjured.args.pixels, delayBytes])

		const dataURI = await (await viem.getContractAt("MagicPlates", pltsAddress)).read.tokenURI([0n])
		const svg = parseSvg(atob(JSON.parse(atob(dataURI.substring(29))).image_data.substring(26)))
		const svgPixels = (svg.children[0] as any).children.map((rect: any) => {
			if (rect.children.length == 0) {
				return [colors.findIndex(c => c === rect.properties.fill)];
			} else {
				return rect.children[0].properties.values.split(";").slice(0, -2).map((v: string) => colors.findIndex(c => c === v))
			}
		});
		expect(
			pixels.every((pxl, i) => pxl.every((idx, j) => { return idx === svgPixels[i][j] ? true : (false || console.log(pxl, svgPixels[i])) })), 
			"conjured/minted pixels don't match svg.").to.be.true

		const { pixels: underlyingPixels, delays: underlyingDelays, name } = await plts.read.plateById([0n])
		expect(pixels.length, "conjured / underlying pixel length mismatch.").eq(underlyingPixels.length)

		expect(hexToString(name, { size: 16 }) == "Test", "Incorrect name.").to.be.true

		expect(underlyingDelays.map(d => [d.idx, d.delay]).every((d, i) => d.every((v, j) => v === delays[i][j])), "delays do not match").to.be.true

		expect(pixels.every((pxl, i) => pxl.every((idx, j) => idx === underlyingPixels[i][j])), "conjured/minted pixels don't match underlying.").to.be.true

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

		await pxls.write.mint([stringToHex("Test", { size: 16 }), conjured.args.pixels, "0x"])
	})

})