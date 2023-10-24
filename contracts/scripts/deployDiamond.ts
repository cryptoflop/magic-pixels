/* global ethers */
/* eslint prefer-const: "off" */

import type { Contract, FunctionFragment } from 'ethers'
import { ethers } from 'hardhat'

const { getSelectors, FacetCutAction } = require('./libraries/diamond.js')

export async function deployDiamond(facets?: string[], init?: Contract) {
  const accounts = await ethers.getSigners()
  const contractOwner = accounts[0]

  // deploy DiamondCutFacet
  const DiamondCutFacet = await ethers.getContractFactory('DiamondCutFacet')
  const diamondCutFacet = await DiamondCutFacet.deploy()
  await diamondCutFacet.waitForDeployment()
	const diamondCutFacetAddress = await diamondCutFacet.getAddress()
  console.log('DiamondCutFacet deployed:', diamondCutFacetAddress)

  // deploy Diamond
  const Diamond = await ethers.getContractFactory('Diamond')
  const diamond = await Diamond.deploy(contractOwner.address, diamondCutFacetAddress)
  await diamond.waitForDeployment()
	const diamondAddress = await diamond.getAddress()
  console.log('Diamond deployed:', diamondAddress)

  // deploy DiamondInit
  // DiamondInit provides a function that is called when the diamond is upgraded to initialize state variables
  // Read about how the diamondCut function works here: https://eips.ethereum.org/EIPS/eip-2535#addingreplacingremoving-functions
  let diamondInit = init
  if (!diamondInit) {
    const DiamondInit = await ethers.getContractFactory('DiamondInit')
    diamondInit = (await DiamondInit.deploy()) as unknown as Contract
    await diamondInit!.waitForDeployment()
    console.log('DiamondInit deployed:', await diamondInit.getAddress())
  }
	const diamondInitAddress = await diamondInit.getAddress()

  // deploy facets
  console.log('')
  console.log('Deploying facets')
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
    console.log(`${FacetName} deployed: ${address}`)
    cut.push({
      facetAddress: address,
      action: FacetCutAction.Add,
      functionSelectors: getSelectors(facet)
    })
  }

  // upgrade diamond with facets
  // console.log('')
  // console.log('Diamond Cut:', cut)
  const diamondCut = await ethers.getContractAt('IDiamondCut', diamondAddress.toString())
  let tx
  let receipt
  // call to init function
  let functionCall = diamondInit.interface.encodeFunctionData(diamondInit.interface.getFunction("init")!)
  tx = await diamondCut.diamondCut(cut, diamondInitAddress, functionCall)
  console.log('Diamond cut tx: ', tx.hash)
  receipt = await tx.wait()
  if (!receipt?.status) {
    throw Error(`Diamond upgrade failed: ${tx.hash}`)
  }
  console.log('Completed diamond cut')
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