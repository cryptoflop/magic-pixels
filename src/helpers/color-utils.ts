import colorPallet from '../assets/pixel-colors.json'
import colorPalletNames from '../assets/pixel-names.json'

import { rndBtwn } from './utils'

export const BLACK = 190
export const WHITE = 0
export const EMPTY = -1
export const MIN_PIXEL = WHITE
export const MAX_PIXEL = BLACK
export const MAX_PALETTE = 9

export function rndPixel() {
  return Array(Math.ceil(rndBtwn(1, 2))).fill(1).map(() => rndColorIdx())
} 

export function rndColorIdx() {
  return rndBtwn(MIN_PIXEL, MAX_PIXEL)
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
  const groupIdx = Math.ceil(idx / MAX_PALETTE) - 1
  const palletIdx = (idx - 1) % MAX_PALETTE
  return colorPalletNames[groupIdx] + '-' + (palletIdx + 1)
}

export function fullPixelName(pixel: number[]) {
  return pixel.map((idx) => pixelName(idx)).join(" > ");
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
  const groupIdx = Math.ceil(idx / MAX_PALETTE) - 1
  const palletIdx = (idx - 1) % MAX_PALETTE
  return colorPallet[groupIdx][palletIdx]
}

export function pixelizeElement(el: HTMLElement, pixel: PixelData) {
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

export function comparePixel(a: PixelData, b: PixelData) {
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      return false
    }
  }
  return true
}

export function formatDelay(delay: number) {
  let str = delay.toString().padStart(3, "0");
  return str.substring(0, 1) + "." + str.substring(1);
}

export function pixelsToSvg(pixels: PixelData[], delays: number[][], asDataUri = true) {
  const dimension = Math.sqrt(pixels.length);
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
                shape-rendering="optimizeSpeed" viewBox="0 0 ${dimension} ${dimension}">`;
  for (let i = 0; i < pixels.length; i++) {
    const pixel = pixels[i]
    svg += `<rect width="1" height="1" x="${i % dimension}" y="${Math.ceil((i + 1) / dimension) - 1}" fill="${pixelColor(pixel[0])}">
      <animate attributeName="fill" dur="${pixel.length + 1}s" repeatCount="indefinite" begin="${formatDelay(delays.find(v => v[0] == i)?.[1] || 0)}s"
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