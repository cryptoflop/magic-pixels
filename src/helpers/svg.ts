import { PixelData } from '../elements/Pixel';
import { pixelColor } from './color-utils';
import { rndBtwn } from './utils';

export function createSvg(width: number, height: number, generator: (i: number, x: number, y: number) => string, asDataUri = true) {
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
                  shape-rendering="optimizeSpeed" viewBox="0 0 ${width} ${height}">`;
  for (let i = 0; i < (height * width); i++) {
    const x = i % width;
    const y = Math.ceil((i + 1) / width) - 1;
    svg += generator(i, x, y);
  }
  svg += '</svg>';
  if (asDataUri) {
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
  } else {
    return svg;
  }
}

export function createSvgPixel(
  x: number, y: number, colors: string[] | number[],
  def?: { h?: number, w?: number, begin?: number, dur?: number, repeat?: string }
) {
  colors = typeof colors[0] === 'number' ? colors.map(p => pixelColor(p as number)) : colors
  def = { ...{ h: 1, w: 1, begin: rndBtwn(10, 1000) / 1000, dur: rndBtwn(3, 5), repeat: 'indefinite' }, ...(def ?? {}) }
  return `<rect width="${def.w}" height="${def.h}" x="${x}" y="${y}" fill="${colors[0]}">
    <animate attributeName="fill" dur="${def.dur}s" repeatCount="${def.repeat}" begin="${def.begin}s" values="${colors.join(';')}" />
  </rect>`
}

export function pixelsToSvg(pixels: PixelData[], asDataUri = true) {
  const dimension = Math.sqrt(pixels.length);
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
                  shape-rendering="optimizeSpeed" viewBox="0 0 16 16">`;
  for (let i = 0; i < pixels.length; i++) {
    svg += `<rect width="1" height="1" x="${i % dimension}" y="${Math.ceil((i + 1) / dimension) - 1}" fill="${pixelColor(pixels[i][0])}">
        <animate attributeName="fill" dur="3s" repeatCount="indefinite" begin="${rndBtwn(1, 1000) / 1000}s"
        values="${pixels[i].concat([pixels[i][0]]).map(p => pixelColor(p)).join(';')}" />
      </rect>`;
  }
  svg += '</svg>';
  if (asDataUri) {
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
  } else {
    return svg;
  }
}