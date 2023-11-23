import { encodePixel } from '../../contracts/scripts/libraries/pixel-parser'
import colorPallet from '../assets/pixel-colors.json'
import colorPalletNames from '../assets/pixel-names.json'

import { rndBtwn } from './utils'

export const MIN_PIXEL = 1
export const MAX_PIXEL = 191
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
	const groupIdx = Math.ceil(idx / MAX_PALETTE) - 1
	const palletIdx = (idx - 1) % MAX_PALETTE
	return [groupIdx, palletIdx]
}

export function pixelName(idx: number) {
	if (idx == 190) return "Black"
	if (idx == 191) return "White"

	const [groupIdx, palletIdx] = getPalletIndices(idx)
	return colorPalletNames[groupIdx] + '-' + (palletIdx + 1)
}

export function pixelColor(idx: number) {
	if (idx === 0 || idx > MAX_PIXEL) {
		console.warn("Invalid pixel idx: ", idx)
		return 'transparent'
	}

	const [groupIdx, palletIdx] = getPalletIndices(idx)
	return colorPallet[groupIdx][palletIdx]
}

export function hexToRgb(hex: string) {
	hex = hex.replace(/^#/, '');
	const bigint = parseInt(hex, 16);
	const r = (bigint >> 16) & 255;
	const g = (bigint >> 8) & 255;
	const b = bigint & 255;
	return [r, g, b];
}

export function pixelizeElement(el: HTMLElement, pixel: Pixel, sync = true) {
	if (pixel.length === 1) {
		el.style.background = pixelColor(pixel[0]);
	} else {
		const stops = pixel.map((color) => pixelColor(color));
		const len = (stops.length + 1) * 1000
		el.animate(
			stops
				.map((s) => ({ backgroundColor: s }))
				.concat([{ backgroundColor: stops[0] }]),
			{
				duration: len,
				iterations: Infinity,
				// easing: 'cubic-bezier(0, 1, 1, 0)'
			}
		).currentTime = sync ? performance.now() % len : 0;
	}
}

export function comparePixel(a: Pixel, b: Pixel) {
	return encodePixel(a) === encodePixel(b)
}

export function formatDelay(delay: number) {
	const secs = delay % 60
	return Math.floor(delay / 60) + '.' + (secs < 10 ? "0" : "") + secs
}

export function pixelsToSvg(pixels: Pixel[], delays: Delay[], asDataUri = true) {
	const dimension = Math.sqrt(pixels.length);
	let svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
                shape-rendering="optimizeSpeed" viewBox="0 0 ${dimension} ${dimension}">`;
	for (let i = 0; i < pixels.length; i++) {
		const pixel = pixels[i]
		if (pixel.length == 0) continue;
		svg += `<rect width="1" height="1" x="${i % dimension}" y="${Math.ceil((i + 1) / dimension) - 1}" fill="${pixelColor(pixel[0])}">
      ${pixel.length > 1 ? `<animate attributeName="fill" dur="${pixel.length + 1}s" repeatCount="indefinite" begin="${formatDelay(delays.find(v => v.idx == i)?.delay || 0)}s"
      values="${pixel.concat([pixel[0]]).map(p => pixelColor(p)).join(';')}" />` : ''}
    </rect>`;
	}
	svg += '</svg>';
	if (asDataUri) {
		return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
	} else {
		return svg;
	}
}