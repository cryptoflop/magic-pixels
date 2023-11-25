import { expect } from 'chai'

import { viem } from 'hardhat'

import { deployPlts } from '../scripts/MagicPlates'
import { colors } from '../scripts/colors'
import { Address } from 'viem'

describe('MagicPlates', function () {
	let pltsAddress: `0x${string}`
	let testAddr = "0x9D42b41c8f7fa67f3Aa40C0B4596e51Ce9b12740" as Address

	before(async function() {
		pltsAddress = await deployPlts()
	})

  it('Should deploy', async function () {
		const plts = await viem.getContractAt("MagicPlates", pltsAddress)
    expect(plts).not.false
  })

	it('Should set pixels address', async function () {
		const plts = await viem.getContractAt("MagicPlates", pltsAddress)
		await plts.write.setMagicPixels([testAddr])
	})

	it('Should set pixel colors', async function () {
		const plts = await viem.getContractAt("MagicPlates", pltsAddress)
		await plts.write.setColors([colors])
	})

	// it('Should shatter plate correctly', async function () {
	// 	const tester = await viem.getWalletClient(testAddr)
	// 	const plts = await viem.getContractAt("MagicPlates", pltsAddress)
	// 	await plts.write.setMagicPixels([testAddr])
	// 	await plts.write.mint(["0x9D42b41c8f7fa67f3Aa40C0B4596e51Ce9b12740", "0x00000000000000000000000000000000", "0x0100020002000304", "0x0000"], { account: tester.account })
	// })

})