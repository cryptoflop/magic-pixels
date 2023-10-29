import { viem } from 'hardhat'

import { deployDiamond } from './deployDiamond'

export async function deployPxls() {
  const pxlsInit = await viem.deployContract('MagicPixelsInit')

  const diamondAddress = await deployDiamond(['PxlsCommon', 'PxlsRng', 'PxlsNether', 'PxlsCore', 'PxlsSetters', 'AuctionHouse'], pxlsInit)

	return diamondAddress as `0x${string}`
}

if (require.main === module) {
  deployPxls()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error)
      process.exit(1)
    })
}
