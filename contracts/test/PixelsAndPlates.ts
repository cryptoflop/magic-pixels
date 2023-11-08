import { expect } from 'chai'

import { ethers, viem } from 'hardhat'
import { decodeEventLog, parseEther } from 'viem'
import { bytesToPixels } from '../scripts/libraries/pixel-parser'

import { deployPxls } from '../scripts/MagicPixels'
import { deployPlts } from '../scripts/MagicPlates'

describe('PixelsAndPlates', function () {
	let publicClient: Awaited<ReturnType<typeof viem.getPublicClient>>

	let pxlsAddress: `0x${string}`
	let pltsAddress: `0x${string}`

	before(async function() {
		publicClient = await viem.getPublicClient()

		pxlsAddress = await deployPxls()
		pltsAddress = await deployPlts()

		const pxls = await viem.getContractAt("PxlsSetters", pxlsAddress)
		await pxls.write.setMagicPlates([pltsAddress])
		const plts = await viem.getContractAt("MagicPlates", pltsAddress)
		await plts.write.setMagicPixels([pxlsAddress])

		await plts.write.setColors([
			[
					'000000', // idx 0 is never used
					'ffffff',
					'f1f5f9',
					'e2e8f0',
					'cbd5e1',
					'94a3b8',
					'64748b',
					'475569',
					'334155',
					'1e293b',
					'0f172a',
					'f3f4f6',
					'e5e7eb',
					'd1d5db',
					'9ca3af',
					'6b7280',
					'4b5563',
					'374151',
					'1f2937',
					'111827',
					'f4f4f5',
					'e4e4e7',
					'd4d4d8',
					'a1a1aa',
					'71717a',
					'52525b',
					'3f3f46',
					'27272a',
					'18181b',
					'f5f5f4',
					'e7e5e4',
					'd6d3d1',
					'a8a29e',
					'78716c',
					'57534e',
					'44403c',
					'292524',
					'1c1917',
					'fee2e2',
					'fecaca',
					'fca5a5',
					'f87171',
					'ef4444',
					'dc2626',
					'b91c1c',
					'991b1b',
					'7f1d1d',
					'ffedd5',
					'fed7aa',
					'fdba74',
					'fb923c',
					'f97316',
					'ea580c',
					'c2410c',
					'9a3412',
					'7c2d12',
					'fef3c7',
					'fde68a',
					'fcd34d',
					'fbbf24',
					'f59e0b',
					'd97706',
					'b45309',
					'92400e',
					'78350f',
					'fef9c3',
					'fef08a',
					'fde047',
					'facc15',
					'eab308',
					'ca8a04',
					'a16207',
					'854d0e',
					'713f12',
					'ecfccb',
					'd9f99d',
					'bef264',
					'a3e635',
					'84cc16',
					'65a30d',
					'4d7c0f',
					'3f6212',
					'365314',
					'dcfce7',
					'bbf7d0',
					'86efac',
					'4ade80',
					'22c55e',
					'16a34a',
					'15803d',
					'166534',
					'14532d',
					'd1fae5',
					'a7f3d0',
					'6ee7b7',
					'34d399',
					'10b981',
					'059669',
					'047857',
					'065f46',
					'064e3b',
					'ccfbf1',
					'99f6e4',
					'5eead4',
					'2dd4bf',
					'14b8a6',
					'0d9488',
					'0f766e',
					'115e59',
					'134e4a',
					'cffafe',
					'a5f3fc',
					'67e8f9',
					'22d3ee',
					'06b6d4',
					'0891b2',
					'0e7490',
					'155e75',
					'164e63',
					'e0f2fe',
					'bae6fd',
					'7dd3fc',
					'38bdf8',
					'0ea5e9',
					'0284c7',
					'0369a1',
					'075985',
					'0c4a6e',
					'dbeafe',
					'bfdbfe',
					'93c5fd',
					'60a5fa',
					'3b82f6',
					'2563eb',
					'1d4ed8',
					'1e40af',
					'1e3a8a',
					'e0e7ff',
					'c7d2fe',
					'a5b4fc',
					'818cf8',
					'6366f1',
					'4f46e5',
					'4338ca',
					'3730a3',
					'312e81',
					'ede9fe',
					'ddd6fe',
					'c4b5fd',
					'a78bfa',
					'8b5cf6',
					'7c3aed',
					'6d28d9',
					'5b21b6',
					'4c1d95',
					'f3e8ff',
					'e9d5ff',
					'd8b4fe',
					'c084fc',
					'a855f7',
					'9333ea',
					'7e22ce',
					'6b21a8',
					'581c87',
					'fae8ff',
					'f5d0fe',
					'f0abfc',
					'e879f9',
					'd946ef',
					'c026d3',
					'a21caf',
					'86198f',
					'701a75',
					'fce7f3',
					'fbcfe8',
					'f9a8d4',
					'f472b6',
					'ec4899',
					'db2777',
					'be185d',
					'9d174d',
					'831843',
					'ffe4e6',
					'fecdd3',
					'fda4af',
					'fb7185',
					'f43f5e',
					'e11d48',
					'be123c',
					'9f1239',
					'881337',
					'000000'
			].map((c) => '%23' + c),
		])
	})

	it('Should conjure, mint, and check the plate', async function () {
		const [acc] = await viem.getWalletClients()
		const pxls = await viem.getContractAt("PxlsCore", pxlsAddress)
		const plts = await viem.getContractAt("MagicPlates", pltsAddress)

		const conjureTx = await pxls.write.conjure([256n], { value: parseEther("0.15") })
		const conjureRcpt = await publicClient.waitForTransactionReceipt({ hash: conjureTx })
		const conjured = decodeEventLog({ ...conjureRcpt.logs[0], abi: pxls.abi, eventName: "Conjured" })
	
		await pxls.write.mint([bytesToPixels(conjured.args.pixels), []]) // TODO: use delays
		
		const svgDataURI = await (await ethers.getContractAt("MagicPlates", pltsAddress)).tokenURI(0, { gasLimit: 999999999999999999n }) // viem fails in this case, ethers doesn't...
		expect(svgDataURI, "invalid svg data uri").includes("data:image/svg+xml")

		// TODO: check if pixels are the correct color...
		
		const pixels = bytesToPixels(conjured.args.pixels)
		const { pixels: underlyingPixels } = await plts.read.plateById([0n]) // TODO: check delays?
		expect(pixels.length, "conjured / underlaying pixel length mismatch.").eq(underlyingPixels.length)

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
	})

	it('Should mint 8x8 plate', async function() {
		const [acc] = await viem.getWalletClients()
		const pxls = await viem.getContractAt("PxlsCore", pxlsAddress)
		const plts = await viem.getContractAt("MagicPlates", pltsAddress)

		const conjureTx = await pxls.write.conjure([64n], { value: parseEther("0.15") })
		const conjureRcpt = await publicClient.waitForTransactionReceipt({ hash: conjureTx })
		const conjured = decodeEventLog({ ...conjureRcpt.logs[0], abi: pxls.abi, eventName: "Conjured" })
		
		await pxls.write.mint([bytesToPixels(conjured.args.pixels), []]) // TODO: use delays
	})

})