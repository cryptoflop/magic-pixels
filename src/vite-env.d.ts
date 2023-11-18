/// <reference types="svelte" />
/// <reference types="vite/client" />


var NULL_ADDR: `0x${string}`;

type Pixel = number[]
type PixelId = `0x${string}`

type Delay = { idx: number, delay: number }
type Plate = { id: bigint, name: string, pixels: number[][], delays: Delay[] }
type P2PTrade = { id: `0x${string}`, creator: `0x${string}`, receiver: `0x${string}`, pixels: PixelId[], price: bigint, tradeType: number }