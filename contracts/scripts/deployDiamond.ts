import { viem } from 'hardhat'
import { encodeFunctionData, type Abi, type GetContractReturnType } from 'viem'

import { getSelectors, FacetCutAction } from './libraries/diamond';

export async function deployDiamond(facets?: string[], init?: GetContractReturnType<Abi>) {
	const publicClient = await viem.getPublicClient()
  const [contractOwner] = await viem.getWalletClients()

  // deploy DiamondCutFacet
  const diamondCutFacet = await viem.deployContract('DiamondCutFacet')

  // deploy Diamond
  const diamond = await viem.deployContract('Diamond', [contractOwner.account.address, diamondCutFacet.address])

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
  for (const facetName of FacetNames) {
    const facet = await viem.deployContract(facetName)
    cut.push({
      facetAddress: facet.address,
      action: FacetCutAction.Add,
      functionSelectors: getSelectors(facet.abi)
    })
  }

  // upgrade diamond with facets
  const diamondCut = await viem.getContractAt('IDiamondCut', diamond.address)

  // call to init function
  let functionCall = encodeFunctionData({ abi: diamondInit!.abi, functionName: "init" })
  const tx = await diamondCut.write.diamondCut([cut, diamondInitAddress, functionCall])
  const receipt = await publicClient.waitForTransactionReceipt({ hash: tx })
  if (receipt.status === "reverted") {
    throw Error(`Diamond upgrade failed: ${tx}`)
  }
  return diamond.address
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