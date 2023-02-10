import colorPallet from '../assets/pixel-colors.json'
import colorPalletNames from '../assets/pixel-names.json'

import { rndBtwn } from './utils'

export const BLACK = 221
export const WHITE = 0
export const EMPTY = -1

export function rndColorIdx() {
  return rndBtwn(WHITE, BLACK)
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
  const groupIdx = Math.ceil(idx / 10) - 1
  const palletIdx = (idx - 1) % 10
  return colorPalletNames[groupIdx] + '-' + palletIdx
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
  const groupIdx = Math.ceil(idx / 10) - 1
  const palletIdx = (idx - 1) % 10
  return colorPallet[groupIdx][palletIdx]
}

export function colorShade(color: string, decimal: number) {
  const base = color.startsWith('#') ? 1 : 0

  let r = parseInt(color.substring(base, 3), 16)
  let g = parseInt(color.substring(base + 2, 5), 16)
  let b = parseInt(color.substring(base + 4, 7), 16)

  r = Math.round(r / decimal)
  g = Math.round(g / decimal)
  b = Math.round(b / decimal)

  r = (r < 255) ? r : 255
  g = (g < 255) ? g : 255
  b = (b < 255) ? b : 255

  const rr = ((r.toString(16).length === 1) ? `0${r.toString(16)}` : r.toString(16))
  const gg = ((g.toString(16).length === 1) ? `0${g.toString(16)}` : g.toString(16))
  const bb = ((b.toString(16).length === 1) ? `0${b.toString(16)}` : b.toString(16))

  return `#${rr}${gg}${bb}`
}

export function hex2rgb(hex: string) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore: ignore no left hand side arithmethic
  return{r:'0x'+hex[1]+hex[2]|0,g:'0x'+hex[3]+hex[4]|0,b:'0x'+hex[5]+hex[6]|0}
}

export function rndColors<T extends 'idx' | 'hex' | 'rgb'>(num: number, intensity: number, type: T) {
  return Array(num).fill(1)
    .map(() => rndBtwn(5, 20) * 10 + intensity)
    .map(idx => {
      if (type === 'idx') return idx
      const hex = pixelColor(idx)
      if (type === 'hex') return hex
      return hex2rgb(hex)
    }) as (T extends 'idx' ? number[] : T extends 'hex' ? string[] : T extends 'rgb' ? ReturnType<typeof hex2rgb>[] : never)
}