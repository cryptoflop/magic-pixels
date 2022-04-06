import colorPallet from '../assets/pixel-colors.json';
import colorPalletNames from '../assets/pixel-names.json';
import { rndBtwn } from './utils';

export const BLACK = 221;
export const WHITE = 0;

export function rndColorIdx() {
  return rndBtwn(1, 220);
}

export function pixelName(idx: number) {
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