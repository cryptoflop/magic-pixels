import { ethers, viem } from 'hardhat'
import { encodeFunctionData, type Abi, type GetContractReturnType } from 'viem'

const { getSelectors, FacetCutAction } = require('./libraries/diamond-old');

export async function deployDiamond(facets?: string[], init?: GetContractReturnType<Abi>) {
  const accounts = await ethers.getSigners()
  const contractOwner = accounts[0]

  // deploy DiamondCutFacet
  const DiamondCutFacet = await ethers.getContractFactory('DiamondCutFacet')
  const diamondCutFacet = await DiamondCutFacet.deploy()
  await diamondCutFacet.waitForDeployment()
	const diamondCutFacetAddress = await diamondCutFacet.getAddress()

  // deploy Diamond
  const Diamond = await ethers.getContractFactory('Diamond')
  const diamond = await Diamond.deploy(contractOwner.address, diamondCutFacetAddress)
  await diamond.waitForDeployment()
	const diamondAddress = await diamond.getAddress()

  // deploy DiamondInit
  // DiamondInit provides a function that is called when the diamond is upgraded to initialize state variables
  // Read about how the diamondCut function works here: https://eips.ethereum.org/EIPS/eip-2535#addingreplacingremoving-functions
  let diamondInit = init
  if (!diamondInit) { init = await viem.deployContract('DiamondInit') }
	const diamondInitAddress = diamondInit!.address

  // deploy facets
  const FacetNames = [
    'DiamondLoupeFacet',
    'OwnershipFacet'
  ].concat(facets ?? [])
  const cut = []
  for (const FacetName of FacetNames) {
    const Facet = await ethers.getContractFactory(FacetName)
		const facet = await Facet.deploy()
		await facet.waitForDeployment()
		const address = await facet.getAddress()
    cut.push({
      facetAddress: address,
      action: FacetCutAction.Add,
      functionSelectors: getSelectors(facet)
    })
  }

  // upgrade diamond with facets
  const diamondCut = await ethers.getContractAt('IDiamondCut', diamondAddress.toString())
  let tx
  let receipt
  // call to init function
  let functionCall = encodeFunctionData({ abi: diamondInit!.abi, functionName: "init" })
  tx = await diamondCut.diamondCut(cut, diamondInitAddress, functionCall)
  receipt = await tx.wait()
  if (!receipt?.status) {
    throw Error(`Diamond upgrade failed: ${tx.hash}`)
  }
  return diamondAddress
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
if (require.main === module) {
  deployDiamond()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error)
      process.exit(1)
    })
}