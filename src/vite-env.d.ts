/// <reference types="svelte" />
/// <reference types="vite/client" />

type PixelId = `0x${string}`
type PixelData = number[]

type Delay = { idx: bigint, delay: number }
type Plate = { id: bigint, pixels: number[][], delays: Delay[] }
type P2PTrade = { id: `0x${string}`, seller: string, buyer: string, pixels: number[][], price: bigint }