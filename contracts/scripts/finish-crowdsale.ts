import { ethers } from 'hardhat'
import { ngufCrowdsaleAddress } from '../generated'

export async function deploy () {
  const [creatooor] = await ethers.getSigners()

  const crowdsale = await ethers.getContractAt('NGUFCrowdsale', ngufCrowdsaleAddress[1], creatooor)

  console.log('Finalizing...')
  await crowdsale.finalizeCrowdsale()

  await (new Promise(r => setTimeout(r, 1000)))

  console.log(await crowdsale.tokeen())
}

deploy().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
