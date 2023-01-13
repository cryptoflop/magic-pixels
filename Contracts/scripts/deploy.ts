import { ethers } from 'hardhat'

async function main() {
  const [owner] = await ethers.getSigners()

  const MagicPixels = await ethers.getContractFactory('MagicPixels')
  const magicPixels = await MagicPixels.deploy()
  await magicPixels.deployed()

  await magicPixels.initialize()

  console.log(`MagicPixels deployed at ${magicPixels.address}`)

  await magicPixels.setNether(owner.address)

  console.log(`Set Nether as self: ${owner.address}`)

  await magicPixels.mintPixels(owner.address, [1, 2, 3, 4, 5, 6, 7, 9])

  console.log('Pixels conjured')

  console.log(`Pixels: ${await magicPixels.getAllPixels(owner.address)}`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
