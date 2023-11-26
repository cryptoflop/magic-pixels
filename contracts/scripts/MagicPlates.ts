import { viem, ethers, upgrades } from 'hardhat'
import { colors } from './colors';

export async function deployPlts () {
  // const [creatooor] = await ethers.getSigners();

	const MagicPlates = await ethers.getContractFactory('MagicPlates');

	const plts = await upgrades.deployProxy(MagicPlates, { verifySourceCode: true });
	await plts.deployed()

	// await plts.setMagicPixels("0x2d40d461556A9F198CdA1377E61aD4d60A866E44")
	
	// upgrade
	// const MagicPlatesV2 = await ethers.getContractFactory("MagicPlatesV2");
  // const plts = await upgrades.upgradeProxy("0x35e525F151054E85a199713811BA42D8d723D0D4", MagicPlates);
  // console.log("MagicPlates upgraded");
	// await plts.deployed()

	// console.log(await plts.getAddress())

	// const p = await viem.getContractAt("MagicPlates", "0x3EBa0d9606003e6604ebA2d2ecf0f02b947e9d22")
	// await p.write.setMagicPixels(["0x2d40d461556A9F198CdA1377E61aD4d60A866E44"])
	// await p.write.setColors([colors])

	return plts.address as `0x${string}`
}

if (require.main === module) {
  deployPlts()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error)
      process.exit(1)
    })
}