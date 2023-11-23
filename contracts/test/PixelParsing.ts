import { expect } from 'chai'
import { bytesToPixelIds, bytesToPixels, pixelsToBytes } from '../scripts/libraries/pixel-parser'

describe('PixelParsing', function () {

	it('Should parse 4 pixels correctly', async function () {
		const data = "0x0100010212001214"

		const pixels = bytesToPixels(data)
		expect(pixels.length).eq(4, "bytesToPixels length mismatch.")
		const bytes = pixelsToBytes(pixels)
		expect(bytes).eq(data, "pixelsToBytes mismatch.")
		const bytesArr = bytesToPixelIds(bytes)
		expect(bytesArr.length).eq(4, "bytesToPixelBytes length mismatch.")

		const bytesFinal = ("0x" + bytesArr.map(bytes2 => bytes2.substring(2)).join("")) as `0x${string}`
		expect(data).eq(bytesFinal, "bytesToPixelBytes bytes mismatch.")
	})

})