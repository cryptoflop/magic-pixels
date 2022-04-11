import colorPallet from '../assets/pixel-colors.json';
import colorPalletNames from '../assets/pixel-names.json';
import { PixelData } from '../elements/Pixel';
import { rndBtwn } from './utils';

export const BLACK = 221;
export const WHITE = 0;
export const EMPTY = -1;

export function rndColorIdx() {
  return rndBtwn(WHITE, BLACK);
}

export function pixelName(idx: number) {
  if (idx === EMPTY) {
    return 'EMPTY';
  }
  if (idx === WHITE) {
    return 'White';
  }
  if (idx === BLACK) {
    return 'Black';
  }
  const groupIdx = Math.ceil(idx / 10) - 1;
  const palletIdx = (idx - 1) % 10;
  return colorPalletNames[groupIdx] + '-' + palletIdx;
}

export function pixelColor(idx: number) {
  if (idx === EMPTY) {
    return 'transparent';
  }
  if (idx === WHITE) {
    return '#ffffff';
  }
  if (idx === BLACK) {
    return '#000000';
  }
  const groupIdx = Math.ceil(idx / 10) - 1;
  const palletIdx = (idx - 1) % 10;
  return colorPallet[groupIdx][palletIdx];
}

export function pixelsToSvg(pixels: PixelData[], asDataUri = true) {
  const dimension = Math.sqrt(pixels.length);
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
                shape-rendering="optimizeSpeed" viewBox="0 0 16 16">`;
  for (let i = 0; i < pixels.length; i++) {
    svg += `<rect width="1" height="1" x="${i % dimension}" y="${Math.ceil((i + 1) / dimension) - 1}" fill="${pixelColor(pixels[i][0])}">
      <animate attributeName="fill" dur="3s" repeatCount="indefinite" begin="${rndBtwn(1, 1000) / 1000}s"
      values="${pixels[i].concat([pixels[i][0]]).map(p => pixelColor(p))
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