import { ethers, upgrades } from 'hardhat'

export async function deployPlts () {
  // const [creatooor] = await ethers.getSigners();

	const MagicPlates = await ethers.getContractFactory('MagicPlates');
	const plts = await upgrades.deployProxy(MagicPlates);
	await plts.waitForDeployment()
	
	// upgrade
	// const MagicPlatesV2 = await ethers.getContractFactory("MagicPlatesV2");
  // const pltsv2 = await upgrades.upgradeProxy(PLTS_ADDRESS, MagicPlatesV2);
  // console.log("MagicPlates upgraded");

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