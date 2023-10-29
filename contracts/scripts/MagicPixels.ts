import { ethers } from 'hardhat'

import { deployDiamond } from './deployDiamond'
import type { Contract } from 'ethers'

// const { mine } = require('@nomicfoundation/hardhat-network-helpers');

export async function deployPxls() {
  const MagicPixelsInit = await ethers.getContractFactory('MagicPixelsInit')
  const magicPixelsInit = await MagicPixelsInit.deploy()
  await magicPixelsInit.waitForDeployment()

  const diamondAddress = await deployDiamond(['PxlsCommon', 'PxlsCore', 'PxlsSetters', 'PxlsRng', 'AuctionHouse'], magicPixelsInit as unknown as Contract)
	// const diamondCutFacet = await ethers.getContractAt('DiamondCutFacet', diamondAddress)

	// const pxls = await ethers.getContractAt('IMagicPixels', diamondAddress)
  // await mine(3)

  // await pxls.conjure(2, { value: parseEther('0.01') })
  // await pxls.conjure(1, { value: parseEther('0.01') })

  // console.log(await pxls.pixelsOf(deployer.address))

	// await pxls.connect(accounts[1]).withdraw(ethers.utils.parseEther('0.02'));

	return diamondAddress
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
if (require.main === module) {
  deployPxls()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error)
      process.exit(1)
    })
}
