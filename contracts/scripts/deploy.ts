import { ethers, viem } from 'hardhat'

import { Hex, decodeEventLog, numberToHex, parseEther, stringToHex } from 'viem'

import { deployPxls } from './MagicPixels'
import { deployPlts } from './MagicPlates'
import { openTrade } from './trade'
import { colors } from './colors'
import { bytesToPixels } from './libraries/pixel-parser'


export async function deploy () {
	// const [acc1, acc2] = await viem.getWalletClients()
	const publicClient = await viem.getPublicClient()

	const pxlsAddress = await deployPxls()
	console.log("Pixels: " + pxlsAddress)
	const pltsAddress = await deployPlts()
	const plts = await viem.getContractAt('MagicPlates', pltsAddress)
	console.log("Plates: " + pltsAddress)

	console.log("Deployed")

  await (await viem.getContractAt("PxlsSetters", pxlsAddress)).write.setMagicPlates([pltsAddress])

  await plts.write.setMagicPixels([pxlsAddress])
  await plts.write.setColors([colors])
	console.log("Colors set")

	const pxlsAdmin = await viem.getContractAt("PxlsAdmin", pxlsAddress)

	// const price = await (await viem.getContractAt("PxlsCommon", pxlsAddress)).read.price()

  // const conjureTx = await pxls.write.conjure([(8n * 8n)], { value: price * (24n * 24n) })
	// const conjureRcpt = await publicClient.waitForTransactionReceipt({ hash: conjureTx })
	// const conjured = decodeEventLog({ ...conjureRcpt.logs[conjureRcpt.logs.length > 1 ? 1: 0], abi: pxls.abi, eventName: "Conjured" })

	// const pixels = bytesToPixels(conjured.args.pixels)

	// const delayBytes = "0x" + Array(2).fill(1)
	// 		.map((_, i) => pixels.findIndex((pxl, j) => pxl.length > 1 && (i > 0 ? (j > 10) : true)))
	// 		.map(idx => [idx, Math.round(Math.random() * (199 - 0) + 0)]).map(d => d.map(n => numberToHex(n, { size: 2 }).substring(2)).join(""))
	// 		.join("") as Hex

  // const mintTx = await pxls.write.mint([stringToHex("Testio test", { size: 16 }), conjured.args.pixels, delayBytes], { gas: 60000000n })
	// await publicClient.waitForTransactionReceipt({ hash: mintTx })

	await pxlsAdmin.write.adminMint([
		"0x4e657468657200000000000000000000",
		"0xbe00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be0094979394be00be00be00be001abebe00be00be00be00be00be00be00be00be00be00be00be00be001abebe00be00be0093949497be00be00be00be00be00be00be00be00be00be00be00be00be001abebe00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be0054565759be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be0057595456be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00b8bab8bab8babe00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00b8bab8bab8babe00be00be00be00be00be00be00be00be00be00be00be001abebe00be00be00be00be00be00be00be00b8bab8bab8babe00be00be00be00be001abebe00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00777977797779be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be0077796e6f7779be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00777977797779be00be00be00be00be00be00be00be00be00be00be00be001c1e1c1e1c1ebe00be00be00be00be00be00be00be00be00be00be00be00be00be00be001abebe00be00be00be00be001c1e1c1e1c1ebe00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be001c1e1c1e1c1ebe00be00be00be001abebe00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00393b4446be00be00be00be00be00be00be00be00be00be00adb7adb7adb7be00be00be00be00be00be00be00be00be004446393bbe00be00be00be00be001abebe00be00be00be00adb7a3a4adb7be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00adb7adb7adb7be00be00be001abebe00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be001abebe00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00be00",
		"0x001e001e001f003200240028003200280036005a0037005000450075006f00380070004600930061009400140095006e00ab002300ac000100ad000c00ba000000c3004100c4003c00c5004600cb002e00ea003200eb001400ec00360102006b01040056011a0014011b005a011c003201290043012a0059012b000f013b003f01410027014200000143004b01590056015a0023015b00650160003c01b3005a01b4003201bf006401c0004601c1000a01cc002801d2000a01d7001e01d8000101d9005a01ef005001f0004601f1001401f5005002120025"
	], { gas: 120000000n })

	const dataURI = await (await ethers.getContractAt("MagicPlates", pltsAddress)).tokenURI(0, { gasLimit: 999999999999999999n })
	console.log(JSON.parse(atob(dataURI.substring(29))).image_data)

	// await plts.write.burn([0n])


	// await openTrade(acc1, pxlsAddress, "0x0000000000000000000000000000000000000000")
	// const [id] = await openTrade(acc2, pxlsAddress, acc1.account.address)
	// console.log('Test trade: ' + id)
}

deploy().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
