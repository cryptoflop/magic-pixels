import { viem } from 'hardhat'

import { decodeEventLog } from 'viem'
import { bytesToPixels } from './libraries/pixel-parser'

import { deployPxls } from './MagicPixels'
import { colors } from './colors'


export async function testPixels() {
	const publicClient = await viem.getPublicClient()

	const pxlsAddress = await deployPxls() as `0x${string}`

	const pxls = await viem.getContractAt("PxlsCore", pxlsAddress)

	const missing: { [key: number]: boolean } = {}
	for (let i = 1; i < colors.length; i++) {
		missing[i] = true;
	}
	
	let searching = true

	function examinePixels(pixels: number[][]) {
		pixels.forEach(pxl => {
			if (pxl.length < 1 || pxl.length > 2 || !pxl.every((v, i, arr) => i < arr.length - 1 ? v < arr[i + 1] : true)) {
				console.log("Weird pixel", pxl)
			}
			pxl.forEach(idx => {
				if (idx < 1 || idx > colors.length) {
					console.log("Weird pixel", pxl)
				}
			})
			if (missing[pxl[1]]) {
				delete missing[pxl[1]]
			}
		})
		
		if (Object.keys(missing).length === 0) {
			// searching = false
		}
	}

	const price = await (await viem.getContractAt("PxlsCommon", pxlsAddress)).read.price() * 256n

	let i = 1
	while (searching) {
		const conjureTx = await pxls.write.conjure([256n], { value: price })
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
