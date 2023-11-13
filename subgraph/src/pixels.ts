import { Bytes } from "@graphprotocol/graph-ts"
import { Conjured as ConjuredEvent, Used as UsedEvent } from "../generated/Pixels/PxlsCore"
import { PixelBalance } from "../generated/schema"
import { PixelBalances } from "./utils/PixelBalances"

const MAX_PIXEL_LENGTH = 4
const P_LEN = MAX_PIXEL_LENGTH * 2

function chopPixelBytes(bytes: Bytes): string[] {
	const pixelBytes = bytes.toHex().substring(2)

	const chopped: string[] = []
	const len = (pixelBytes.length / P_LEN);
	for (let i = 0; i < len; i++) {
		const pxlId = pixelBytes.slice(i * P_LEN, i * P_LEN + P_LEN)
		chopped.push(pxlId)
	}

	return chopped
}


export function handleConjured(event: ConjuredEvent): void {
	const conjurerId = event.params.conjurer.toHex()

	let pixels = PixelBalance.load(conjurerId)
	
	if (!pixels) {
		pixels = new PixelBalance(conjurerId);
    pixels.balances = "";
	}

	const balances = PixelBalances.fromString(pixels.balances);

	const pixelIds = chopPixelBytes(event.params.pixels)
	for (let i = 0; i < pixelIds.length; i++)  {
		const pxlId = pixelIds[i]

		// increase pixel balance by 1
		balances.increment(pxlId)
	}

	pixels.last_block = event.block.number
	pixels.balances = balances.toString();

	pixels.save()
}

export function handleUsed(event: UsedEvent): void {
  const userId = event.params.user.toHex()

	const pixels = PixelBalance.load(userId)!
	const balances = PixelBalances.fromString(pixels.balances);

	const pixelIds = chopPixelBytes(event.params.pixels)
	for (let i = 0; i < pixelIds.length; i++)  {
		const pxlId = pixelIds[i]

		// decrease pixel balance by 1
		balances.decrement(pxlId) // this should never go below zero since you would not be able to mint
	}

	pixels.last_block = event.block.number
	pixels.balances = balances.toString();

	pixels.save()
}
