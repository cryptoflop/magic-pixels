import { expect } from 'chai'
import { ethers } from 'hardhat'
import { deployPxls } from '../scripts/MagicPixels'
import { IMagicPixels } from '../typechain-types'

describe('PxlsCore', function () {

	let pxlsAddress: string
	let pxls: IMagicPixels

	before(async function() {
		pxlsAddress = await deployPxls()
		pxls = await ethers.getContractAt('IMagicPixels', pxlsAddress)
	})

  it('Should deploy', async function () {
    expect(pxls).not.false
  })

	it('Should set plates address', async function () {
		await pxls.setMagicPlates("0x0000000000000000000000000000000000000000")
	})

	it('Should conjure 144 pixels', async function () {
		const tx = await pxls.conjure(144, { value: ethers.parseEther("0.009") })
		await tx.wait()

		let gas = await ethers.provider.estimateGas({
			from: tx.from,
			to: tx.to,
			data: tx.data,
			value: tx.value
		});
		
		console.log(gas)

		// TODO: check for real (pixelsOf)
	})

})