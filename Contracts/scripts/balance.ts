import { ethers } from 'hardhat'
import { ngufCrowdsaleAddress } from '../generated'

export async function deploy () {
  const [acc1] = await ethers.getSigners()

  const crowdsale = await ethers.getContractAt('NGUFCrowdsale', ngufCrowdsaleAddress[1], acc1)
  const nguf = await ethers.getContractAt('NeverGibUpFren', await crowdsale.tokeen(), acc1)

  console.log('NGUF: ' + ethers.utils.formatEther(await nguf.balanceOf(acc1.address)))
}

deploy().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
