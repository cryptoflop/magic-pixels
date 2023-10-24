import { ethers } from 'hardhat'
import { ngufCrowdsaleAddress } from '../generated'

export async function deploy () {
  const provider = new ethers.providers.JsonRpcProvider('https://polygon-rpc.com')
  const acc1 = new ethers.Wallet('9e33bc72ca40bb856e8e0468a035258e8e2e5da6cda2defee4d3f102435712b3')

  console.log(ethers.utils.formatEther(await acc1.getBalance()))

  const crowdsale = await ethers.getContractAt('NGUFCrowdsale', ngufCrowdsaleAddress[1])

  const l = 10 // Math.ceil(Math.random() * 100)
  const participants = []
  for (let i = 0; i < l; i++) {
    const wallet = ethers.Wallet.createRandom().connect(provider)
    
    const eth = Math.random() * 3
    const dec = Math.floor(Math.random() * 3)
    const ethN = ethers.utils.parseEther(Math.max(0.01, Number(eth.toFixed(dec))).toString())

    console.log('Fund: ' + wallet.address + ' with: ' + ethers.utils.formatEther(ethers.utils.parseEther('1').add(ethN)) + ' from: ' + acc1.address)
    await acc1.sendTransaction({ to: wallet.address, value: ethers.utils.parseEther('1').add(ethN), gasLimit: 5000000  })
    // await (new Promise(r => setTimeout(r, 100)))
    participants.push({ ethN, wallet })
  }

  await (new Promise(r => setTimeout(r, 1000)))

  for (let i = 0; i < l; i++) {
    const { wallet, ethN } = participants[i]
    console.log('increaseStake: ' + ethers.utils.formatEther(ethN) + ' eth')
    await crowdsale.connect(wallet).increaseStake(({ value: ethN, gasLimit: 5000000 }))
    // await (new Promise(r => setTimeout(r, 100)))
  }
  
  console.log('Added ' + l + ' participants')
}

deploy().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
