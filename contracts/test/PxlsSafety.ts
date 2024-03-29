import { expect } from 'chai'

import { viem } from 'hardhat'

import { deployPxls } from '../scripts/MagicPixels'

describe('PxlsSafety', function () {
	let publicClient: Awaited<ReturnType<typeof viem.getPublicClient>>

	let pxlsAddress: `0x${string}`

	before(async function() {
		publicClient = await viem.getPublicClient()
		pxlsAddress = await deployPxls()
	})

	it('Should test onlyOwner', async function () {
		const [_, acc2] = await viem.getWalletClients()
		const pxls = await viem.getContractAt("PxlsSetters", pxlsAddress, { walletClient: acc2 })

		await expect(pxls.write.setPrice([1n]), "onlyOwner doesn't protect setters").to.be.rejected
	})

	it('Should test enforceDiamondItself', async function () {
		const [_, acc2] = await viem.getWalletClients()
		const pxls = await viem.getContractAt("PxlsNether", pxlsAddress, { walletClient: acc2 })

		await expect(pxls.write.examineNether(["0x0000000000000000000000000000000000000000", 1n, 1n]), "enforceDiamondItself doesn't protect function").to.be.rejected
	})

})