import { BigInt, Bytes } from "@graphprotocol/graph-ts"
import { Conjured as ConjuredEvent, Minted as MintedEvent } from "../generated/Pixels/PxlsCore"
import { Account, PixelBalance } from "../generated/schema"

const MAX_PIXEL_LENGTH = 4

export function handleConjured(event: ConjuredEvent): void {
	const conjurerId = event.params.conjurer.toHex()

	let pixels = Account.load(conjurerId)
	
	if (!pixels) {
		pixels = new Account(conjurerId);
    pixels.balances = [];
	}

	const pixelBytes = event.params.pixels.toHex().substring(2)

	for (let i = 0; i < (pixelBytes.length / (MAX_PIXEL_LENGTH * 2)); i++) {
		const pxlId = pixelBytes.slice(i * (MAX_PIXEL_LENGTH * 2), i * (MAX_PIXEL_LENGTH * 2) + (MAX_PIXEL_LENGTH * 2))
		
		const id = conjurerId + pxlId

		let pixelBalance = PixelBalance.load(id);
		if (!pixelBalance) { 
			pixelBalance = new PixelBalance(id);
			pixelBalance.pixel = Bytes.fromHexString(pxlId)
			pixelBalance.amount = BigInt.fromI32(0);
			pixels.balances = pixels.balances.concat([id]);
		}

		// increase pixel balance by 1
		pixelBalance.amount = pixelBalance.amount.plus(BigInt.fromI32(1))
    
    pixelBalance.save();
	}

	pixels.save()
}

export function handleMinted(event: MintedEvent): void {
  const minterId = event.params.minter.toHex()

	const pixelBytes = event.params.pixels.toHex().substring(2)

	for (let i = 0; i < (pixelBytes.length / (MAX_PIXEL_LENGTH * 2)); i++) {
		const pxlId = pixelBytes.slice(i * MAX_PIXEL_LENGTH, i * MAX_PIXEL_LENGTH + (MAX_PIXEL_LENGTH * 2))
		
		const id = minterId + pxlId

		const pixelBalance = PixelBalance.load(id)! // this should never be null since you can only mint if you have all pixels

		// decrease pixel balance by 1
		pixelBalance.amount = pixelBalance.amount.minus(BigInt.fromI32(1)) // this should never go below zero since you would not be able to mint
		pixelBalance.save();
	}
}
