import { viem } from 'hardhat'

import { decodeEventLog, parseEther, zeroAddress } from 'viem'

import { deployPxls } from './MagicPixels'
import { deployPlts } from './MagicPlates'
import { openTrade } from './trade'
import { colors } from './colors'
import { FacetCutAction, getSelectors } from './libraries/diamond'


export async function updatePxls() {
	// const [acc1, acc2] = await viem.getWalletClients()
	const publicClient = await viem.getPublicClient()

	const diamondAddr = "0x2d40d461556A9F198CdA1377E61aD4d60A866E44"; // await deployPxls();

	(await viem.getContractAt("PxlsCommon", diamondAddr)).write.withdraw([await publicClient.getBalance({ address: diamondAddr })]) 

	// const cutFacet = await viem.getContractAt("DiamondCutFacet", diamondAddr)
	// const loupeFacet = await viem.getContractAt("DiamondLoupeFacet", diamondAddr)

	// const oldCoreAddr = "0x079F13b46550234837BC2189a66ab4153F96b7db"
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

	// const pxlsCoreNew = await viem.deployContract("TrdsCore")

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
