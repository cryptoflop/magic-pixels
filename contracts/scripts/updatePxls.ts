import { ethers, viem } from 'hardhat'

import { decodeEventLog, parseEther, zeroAddress } from 'viem'

import { deployPxls } from './MagicPixels'
import { deployPlts } from './MagicPlates'
import { openTrade } from './trade'
import { colors } from './colors'
import { FacetCutAction, getSelectors } from './libraries/diamond'


export async function updatePxls() {
	// const [acc1, acc2] = await viem.getWalletClients()
	// const publicClient = await viem.getPublicClient()

	const diamondAddr = "0x29DFBc64f9b5B12C7BE207e1A203e4d0dc87Ec06"; // await deployPxls();

	// (await viem.getContractAt("MagicPlates", "0x3EBa0d9606003e6604ebA2d2ecf0f02b947e9d22")).write.setColors([colors])

	const pxlsAdmin = await viem.getContractAt("PxlsSetters", diamondAddr)
	await pxlsAdmin.write.setPrice([0n])

	// const cutFacet = await viem.getContractAt("DiamondCutFacet", diamondAddr)
	// const loupeFacet = await viem.getContractAt("DiamondLoupeFacet", diamondAddr)

	// const oldCoreAddr = "0xEBc5B81bB1f8569d93dA72fEe1993884bA93983B"
	// const oldCoreSelectors = await loupeFacet.read.facetFunctionSelectors([oldCoreAddr])

	// await cutFacet.write.diamondCut([
	// 	[
	// 		{ 
	// 			facetAddress: zeroAddress,
	// 			action: FacetCutAction.Remove,
	// 			functionSelectors: oldCoreSelectors
	// 		}
	// 	],
	// 	zeroAddress,
	// 	"0x"
	// ])

	// console.log(await loupeFacet.read.facetFunctionSelectors([oldCoreAddr]))

	// const pxlsCoreNew = await viem.getContractAt("PxlsCore", "0x443407f3c3DD57fE479c0B025196C1915c82F7B2")

	// await cutFacet.write.diamondCut([
	// 	[
	// 		{
	// 			facetAddress: pxlsCoreNew.address,
	// 			action: FacetCutAction.Add,
	// 			functionSelectors: getSelectors(pxlsCoreNew.abi)
	// 		}
	// 	],
	// 	zeroAddress,
	// 	"0x"
	// ])

	// console.log(await loupeFacet.read.facetFunctionSelectors([pxlsCoreNew.address]))

	// console.log(pxlsCoreNew.address)
}

updatePxls().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
