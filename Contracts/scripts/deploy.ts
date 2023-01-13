import { ethers } from 'hardhat'

async function main() {
  const [owner] = await ethers.getSigners()

  const MagicPixels = await ethers.getContractFactory('MagicPixels')
  const magicPixels = await MagicPixels.deploy()
  await magicPixels.deployed()

  await magicPixels.initialize()

  console.log(`MagicPixels deployed at ${magicPixels.address}`)

  const Nether = await ethers.getContractFactory('Nether')
  const nether = await Nether.deploy()
  await nether.deployed()

  await magicPixels.setNether(nether.address)

  console.log(`Set Nether as: ${nether.address}`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
