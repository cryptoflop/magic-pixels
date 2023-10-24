import { time } from "@nomicfoundation/hardhat-network-helpers";
import { ethers } from 'hardhat'

export async function forward () {
  const [acc] = await ethers.getSigners()
  const provider = acc.provider!
  const b = await provider.getBlock('latest')
  const day = (24 * 60 * 60)
  await time.increaseTo(b.timestamp + day)
}

forward().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
