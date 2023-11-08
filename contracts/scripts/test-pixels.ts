import { viem } from 'hardhat'

import { decodeEventLog, formatEther, parseEther } from 'viem'
import { bytesToPixels } from './libraries/pixel-parser'

import { deployPxls } from './MagicPixels'


export async function testPixels() {
	const publicClient = await viem.getPublicClient()

	const pxlsAddress = await deployPxls() as `0x${string}`

	const pxls = await viem.getContractAt("PxlsCore", pxlsAddress)
	const nether = await viem.getContractAt("PxlsNether", pxlsAddress)

	const missing: { [key: number]: boolean } = {}
	for (let i = 1; i < 191; i++) {
		missing[i] = true;
	}
	
	let searching = true

	function examinePixels(pixels: number[][]) {
		console.log(pixels)
		pixels.forEach(pxl => {
			if (pxl.length < 1 || pxl.length > 2 || !pxl.every((v, i, arr) => i < arr.length - 1 ? v < arr[i + 1] : true)) {
				console.log("Weird pixel", pxl)
			}
			pxl.forEach(idx => {
				if (idx < 1 || idx > 191) {
					console.log("Weird pixel", pxl)
				}
				if (missing[idx]) {
					delete missing[idx]
				}
			})
		})
		
		if (Object.keys(missing).length === 0) {
			// searching = false
		}
	}

	let i = 1
	while (searching) {
		const conjureTx = await pxls.write.conjure([256n], { value: parseEther("0.06") })
		const conjureRcpt = await publicClient.waitForTransactionReceipt({ hash: conjureTx })
		const conjured = decodeEventLog({ ...conjureRcpt.logs[conjureRcpt.logs.length > 1 ? 1 : 0], abi: pxls.abi, eventName: "Conjured" })
		examinePixels(bytesToPixels(conjured.args.pixels))
		console.log(i)
		console.log(Object.keys(missing))
		i++
	}
}

testPixels().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
