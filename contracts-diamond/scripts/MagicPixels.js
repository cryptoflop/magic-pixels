/* global ethers */
/* eslint prefer-const: "off" */

const { getSelector, getSelectors, FacetCutAction } = require('./libraries/diamond.js');
const { deployDiamond } = require('./deploy.js')

const { mine } = require('@nomicfoundation/hardhat-network-helpers');


async function deployPxls() {
  const accounts = await ethers.getSigners()
  const deployer = accounts[0]

  const MagicPixelsInit = await ethers.getContractFactory('MagicPixelsInit')
  const magicPixelsInit = await MagicPixelsInit.deploy()
  await magicPixelsInit.deployed()

  const diamondAddress = await deployDiamond(['PxlsCommon', 'PxlsSetters', 'PxlsCore'], magicPixelsInit)
	// const diamondCutFacet = await ethers.getContractAt('DiamondCutFacet', diamondAddress)

	const pxls = await ethers.getContractAt('IMagicPixels', diamondAddress)

  await mine(3)

  await pxls.conjure(2, { value: ethers.utils.parseEther('0.01') })
  await pxls.conjure(1, { value: ethers.utils.parseEther('0.01') })

  console.log(await pxls.pixelsOf(deployer.address))

	// await pxls.connect(accounts[1]).withdraw(ethers.utils.parseEther('0.02'));
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

exports.deployPxls = deployPxls
