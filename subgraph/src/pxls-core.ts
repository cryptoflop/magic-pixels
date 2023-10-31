import { BigInt } from "@graphprotocol/graph-ts"
import { Conjured as ConjuredEvent, Minted as MintedEvent } from "../generated/PxlsCore/PxlsCore"
import { Pixels, PixelBalance } from "../generated/schema"

const MAX_PIXEL_LENGTH = 4
const ONE = new BigInt(1)

export function handleConjured(event: ConjuredEvent): void {
	const conjurerId = event.params.conjurer.toHex()

	// load pixels of conjurer
	let pixels = Pixels.load(conjurerId)
	
	if (!pixels) {
		pixels = new Pixels(event.params.conjurer.toHex());
    pixels.balances = [];
	}

	const bytes = event.params.pixels.toHex().substring(2)

	for (let i = 0; i < (bytes.length / 4); i++) {
		const pxlId = bytes.slice(i * MAX_PIXEL_LENGTH, i * MAX_PIXEL_LENGTH + (MAX_PIXEL_LENGTH * 2))
		
		const id = conjurerId + pxlId

		let pixelBalance = PixelBalance.load(id);
		if (!pixelBalance) { 
			pixelBalance = new PixelBalance(id);
			pixelBalance.amount = new BigInt(0)
		}

		// increase pixel balance by 1
    pixelBalance.amount = pixelBalance.amount.plus(ONE)
    pixelBalance.save();
	}

	pixels.save()
}

export function handleMinted(event: MintedEvent): void {
  const minterId = event.params.minter.toHex()

	// load pixels of minter
	let pixels = Pixels.load(minterId)
	
	if (!pixels) {
		pixels = new Pixels(event.params.minter.toHex());
    pixels.balances = [];
	}

	const bytes = event.params.pixels.toHex().substring(2)

	for (let i = 0; i < (bytes.length / 4); i++) {
		const pxlId = bytes.slice(i * MAX_PIXEL_LENGTH, i * MAX_PIXEL_LENGTH + (MAX_PIXEL_LENGTH * 2))
		
		const id = minterId + pxlId

		const pixelBalance = PixelBalance.load(id)! // this should never be null since you can only mint if you have all pixels

		if (pixelBalance.amount.equals(ONE)) {
			const idx = pixels.balances.indexOf(id)!
			pixels.balances.splice(idx, 1);
		} else {
			// decrease pixel balance by 1
			pixelBalance.amount = pixelBalance.amount.minus(ONE)
			pixelBalance.save();
		}
	}

	pixels.save()
}
