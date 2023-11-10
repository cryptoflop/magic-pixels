import { expect } from 'chai'

import { viem } from 'hardhat'

import { deployPlts } from '../scripts/MagicPlates'
import { colors } from '../scripts/colors'

describe('MagicPlates', function () {
	let pltsAddress: `0x${string}`

	before(async function() {
		pltsAddress = await deployPlts()
	})

  it('Should deploy', async function () {
		const plts = await viem.getContractAt("MagicPlates", pltsAddress)
    expect(plts).not.false
  })

	it('Should set pixels address', async function () {
		const plts = await viem.getContractAt("MagicPlates", pltsAddress)
		await plts.write.setMagicPixels(["0x9D42b41c8f7fa67f3Aa40C0B4596e51Ce9b12740"])
	})

	it('Should set pixel colors', async function () {
		const plts = await viem.getContractAt("MagicPlates", pltsAddress)
		await plts.write.setColors([colors])
	})

})