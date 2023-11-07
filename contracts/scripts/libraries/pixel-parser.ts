import { hexToBytes, numberToHex, type Hex } from "viem"

const MAX_PIXEL_LENGTH = 4

/** Takes a bytes array and returns an array of bytes in the length of a pixel @see MAX_PIXEL_LENGTH */
export function bytesToPixelBytes(bytes: `0x${string}`) {
	return bytes.substring(2).split("").reduce((arr, _, i, chars) => {
		if (i % (MAX_PIXEL_LENGTH * 2) === 0) {
			arr.push(("0x" + Array(MAX_PIXEL_LENGTH * 2).fill(1).map((_, j) => chars[i + j]).join("")) as `0x${string}`)
		}
		return arr
	}, [] as `0x${string}`[])
}

/** Converts a pixel array into a bytes array */
export function pixelsToBytes(pixels: number[][]) {
	return ("0x" + pixels.map(pxl => Array(MAX_PIXEL_LENGTH).fill(0).map((d, i) => pxl[i] ?? d))
		.map(pxl => pxl.map(idx => numberToHex(idx, { size: 1 }).substring(2)).join("")).join("")) as `0x${string}`
}

/** Converts a bytes array in to a pixel array */
export function bytesToPixels(bytes: `0x${string}`) {
	return hexToBytes(bytes).reduce((arr, _, i, bytes) => {
		if (i % MAX_PIXEL_LENGTH === 0) {
			arr.push(Array(MAX_PIXEL_LENGTH).fill(1).map((_, j) => bytes[i + j]))
		}
		return arr
	}, [] as number[][]).map(pxl => pxl.filter(idx => idx > 0))
}

export function encodePixel(pxl: number[]) {
	return ("0x" + Array(MAX_PIXEL_LENGTH).fill(1).map((_, i) => numberToHex(pxl[i] ?? 0, { size: 1 })).join("")) as Hex
}

export function decodePixel(bytes: Hex) {
	return Array.from(hexToBytes(bytes)).filter(v => v > 0)
}