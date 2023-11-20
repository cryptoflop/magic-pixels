import { viem } from 'hardhat'

import { stringToHex } from 'viem'

export async function mint() {
	// const [acc1, acc2] = await viem.getWalletClients()
	// const publicClient = await viem.getPublicClient()

	const diamondAddr = "0x2d40d461556A9F198CdA1377E61aD4d60A866E44";

	const pxlsAdmin = await viem.getContractAt("PxlsAdmin", diamondAddr);

	await pxlsAdmin.write.adminMint([stringToHex("Name", { size: 16 }), "0x0", []])
}

mint().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
