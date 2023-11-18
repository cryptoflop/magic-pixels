import { viem, ethers, upgrades } from 'hardhat'
import { colors } from './colors';

export async function deployPlts () {
  // const [creatooor] = await ethers.getSigners();

	const MagicPlates = await ethers.getContractFactory('MagicPlates');
	// const plts = await upgrades.deployProxy(MagicPlates, { verifySourceCode: true });
	// await plts.waitForDeployment()
	
	// upgrade
	// const MagicPlatesV2 = await ethers.getContractFactory("MagicPlatesV2");
  const plts = await upgrades.upgradeProxy("0x192E81ab95900dcEb05Efd646a8f224af34BDF9B", MagicPlates);
  // console.log("MagicPlates upgraded");
	await plts.waitForDeployment()

	// console.log(await plts.getAddress())

	// const p = await viem.getContractAt("MagicPlates", "0x192E81ab95900dcEb05Efd646a8f224af34BDF9B")
	// await p.write.setMagicPixels(["0x2d40d461556A9F198CdA1377E61aD4d60A866E44"])
	// await p.write.setColors([colors])

	return (await plts.getAddress()) as `0x${string}`
}

if (require.main === module) {
  deployPlts()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error)
      process.exit(1)
    })
}