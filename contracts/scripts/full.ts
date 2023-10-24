import { ethers } from 'hardhat'
import { time, impersonateAccount } from "@nomicfoundation/hardhat-network-helpers";

export async function full () {
  // const [creatooor] = await ethers.getSigners()

  // const Crowdsale = await ethers.getContractFactory('NGUFCrowdsale', creatooor)
  // const crowdsale = await Crowdsale.deploy({ gasLimit: 5000000 })
  // await crowdsale.deployed()

  // console.log('neverGibUpFren deployed:', crowdsale.address)

  const [_, acc1] = await ethers.getSigners()
  const provider = acc1.provider!

  // console.log(ethers.utils.formatEther(await acc1.getBalance()))

  // const l = 3 // Math.ceil(Math.random() * 100)
  // const participants = []
  // for (let i = 0; i < l; i++) {
  //   const wallet = ethers.Wallet.createRandom().connect(provider)
    
  //   const eth = Math.random() * 3
  //   const dec = Math.floor(Math.random() * 3)
  //   const ethN = ethers.utils.parseEther(Math.max(0.01, Number(eth.toFixed(dec))).toString())

  //   console.log('Fund: ' + wallet.address + ' with: ' + ethers.utils.formatEther(ethers.utils.parseEther('1').add(ethN)) + ' from: ' + acc1.address)
  //   await acc1.sendTransaction({ to: wallet.address, value: ethers.utils.parseEther('1').add(ethN), gasLimit: 5000000  })
  //   // await (new Promise(r => setTimeout(r, 100)))
  //   participants.push({ ethN, wallet })
  // }

  // await (new Promise(r => setTimeout(r, 1000)))

  // for (let i = 0; i < l; i++) {
  //   const { wallet, ethN } = participants[i]
  //   console.log('increaseStake: ' + ethers.utils.formatEther(ethN) + ' eth')
  //   await crowdsale.connect(wallet).increaseStake(({ value: ethN, gasLimit: 5000000 }))
  //   // await (new Promise(r => setTimeout(r, 100)))
  // }
  
  // console.log('Added ' + l + ' participants')

  // await crowdsale.finalizeCrowdsale()

  // await (new Promise(r => setTimeout(r, 100)))

  // const v1Addr = await crowdsale.tokeen()
  // console.log('Launched v1 address: ' + v1Addr)

  // // const now = Math.round(Date.now() / 1000)
  // const b = await provider.getBlock('latest')
  // const eightDays = (8 * 24 * 60 * 60)

  // console.log('Forwarding...')
  
  // await time.increaseTo(b.timestamp + eightDays)

  // const nguf = await ethers.getContractAt('NeverGibUpFren', v1Addr, creatooor)

  // const amt = await nguf.balanceOf(creatooor.address)
  // console.log('creator nguf: ' + ethers.utils.formatEther(amt))

  const address = "0x7982F3dF4Ef77770CD4EC113bE92C2685c7782E8";
  await impersonateAccount(address);
  const me = await ethers.getSigner(address);

  const NGUFMigration = await ethers.getContractFactory('NGUFMigration', acc1)
  const ngufMigration = await NGUFMigration.deploy({ gasLimit: 5000000 })
  await ngufMigration.deployed()

  // console.log('Migration: ' +  ngufMigration.address)

  const salt = Date.now()

  const sellerAddress = await ngufMigration.getSellerAddress(salt)
  console.log(sellerAddress)

  const nguf = await ethers.getContractAt('NeverGibUpFrenV1', '0x5207CA53386E1b462316EC9726B9e150de82Bc14', acc1)

  await nguf.connect(me).transfer(sellerAddress, ethers.utils.parseEther('1000'), { gasLimit: 5000000 });

  console.log(1)
  await (new Promise(r => setTimeout(r, 100)))

  ngufMigration.connect(me).sellV1ForV2(ethers.utils.parseEther('1000'), ethers.BigNumber.from(1), salt, { gasLimit: 5000000 })

  
}

full().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
