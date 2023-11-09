import { encodePixel } from '../../contracts/scripts/libraries/pixel-parser'
import colorPallet from '../assets/pixel-colors.json'
import colorPalletNames from '../assets/pixel-names.json'

import { rndBtwn } from './utils'

export const BLACK = 191
export const WHITE = 1
export const EMPTY = -1
export const MIN_PIXEL = WHITE
export const MAX_PIXEL = BLACK
export const MAX_PALETTE = 9

export function rndPixel() {
	return Array(Math.ceil(rndBtwn(1, 2))).fill(1).map(() => rndColorIdx())
}

export function rndColorIdx(onlyRealColors = false) {
	return rndBtwn(MIN_PIXEL + (onlyRealColors ? 1 : 0), MAX_PIXEL - (onlyRealColors ? 1 : 0))
}

export function fullPixelName(pixel: number[]) {
	return pixel.map((idx) => pixelName(idx)).join(" > ");
}

function getPalletIndices(idx: number) {
	idx = idx - 1 // subtract 1 since index is zero based but our pixel colors start at 1
	const groupIdx = Math.ceil(idx / MAX_PALETTE) - 1
	const palletIdx = (idx - 1) % MAX_PALETTE
	return [groupIdx, palletIdx]
}

export function pixelName(idx: number) {
	if (idx === EMPTY) {
		return 'EMPTY'
	}
	if (idx === WHITE) {
		return 'White'
	}
	if (idx === BLACK) {
		return 'Black'
	}
	if (idx === 0) {
		console.warn("Idx 0 should not be used.")
		return 'Invalid'
	}

	const [groupIdx, palletIdx] = getPalletIndices(idx)
	return colorPalletNames[groupIdx] + '-' + (palletIdx + 1)
}

export function pixelColor(idx: number) {
	if (idx === EMPTY) {
		return 'transparent'
	}
	if (idx === WHITE) {
		return '#ffffff'
	}
	if (idx === BLACK) {
		return '#000000'
	}
	if (idx === 0) {
		console.warn("Idx 0 should not be used.")
		return 'transparent'
	}

	const [groupIdx, palletIdx] = getPalletIndices(idx)
	return colorPallet[groupIdx][palletIdx]
}

export function pixelizeElement(el: HTMLElement, pixel: Pixel) {
	if (pixel.length === 1) {
		el.style.background = pixelColor(pixel[0]);
	} else {
		const stops = pixel.map((color) => pixelColor(color));
		el.animate(
			stops
				.map((s) => ({ backgroundColor: s }))
				.concat([{ backgroundColor: stops[0] }]),
			{
				duration: (stops.length + 1) * 1000,
				iterations: Infinity,
				// easing: 'cubic-bezier(0, 1, 1, 0)'
			}
		) //.currentTime = rndBtwn(0, 900);
	}
}

export function comparePixel(a: Pixel, b: Pixel) {
	return encodePixel(a) === encodePixel(b)
}

export function formatDelay(delay: number) {
	let str = delay.toString().padStart(3, "0");
	return str.substring(0, 1) + "." + str.substring(1);
}

export function pixelsToSvg(pixels: Pixel[], delays: Delay[], asDataUri = true) {
	const dimension = Math.sqrt(pixels.length);
	let svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
                shape-rendering="optimizeSpeed" viewBox="0 0 ${dimension} ${dimension}">`;
	for (let i = 0; i < pixels.length; i++) {
		const pixel = pixels[i]
		svg += `<rect width="1" height="1" x="${i % dimension}" y="${Math.ceil((i + 1) / dimension) - 1}" fill="${pixelColor(pixel[0])}">
      <animate attributeName="fill" dur="${pixel.length + 1}s" repeatCount="indefinite" begin="${formatDelay(delays.find(v => v.idx == i)?.delay || 0)}s"
      values="${pixel.concat([pixel[0]]).map(p => pixelColor(p))
				.join(';')}" />
    </rect>`;
	}
	svg += '</svg>';
	if (asDataUri) {
		return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
	} else {
		return svg;
	}
}