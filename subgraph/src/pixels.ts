import { BigInt, Bytes } from "@graphprotocol/graph-ts"
import { Conjured as ConjuredEvent, Used as UsedEvent } from "../generated/Pixels/PxlsCore"
import { Account, PixelBalance } from "../generated/schema"

const MAX_PIXEL_LENGTH = 4

function chopBytes(bytes: Bytes): string[] {
	const pixelBytes = bytes.toHex().substring(2)

	const pxlLen = MAX_PIXEL_LENGTH * 2

	const chopped: string[] = []
	for (let i = 0; i < (pixelBytes.length / pxlLen); i++) {
		const pxlId = pixelBytes.slice(i * pxlLen, i * pxlLen + pxlLen)
		chopped.push(pxlId)
	}

	return chopped
}

export function handleConjured(event: ConjuredEvent): void {
	const conjurerId = event.params.conjurer.toHex()

	let pixels = Account.load(conjurerId)
	
	if (!pixels) {
		pixels = new Account(conjurerId);
    pixels.balances = [];
	}

	pixels.last_block = event.block.number

	const pixelIds = chopBytes(event.params.pixels)
	for (let i = 0; i < pixelIds.length; i++)  {
		const pxlId = pixelIds[i]
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

export function handleUsed(event: UsedEvent): void {
  const minterId = event.params.minter.toHex()

	const pixelIds = chopBytes(event.params.pixels)
	for (let i = 0; i < pixelIds.length; i++)  {
		const pxlId = pixelIds[i]
		const id = minterId + pxlId

		const pixelBalance = PixelBalance.load(id)! // this should never be null since you can only mint if you have all pixels

		// decrease pixel balance by 1
		pixelBalance.amount = pixelBalance.amount.minus(BigInt.fromI32(1)) // this should never go below zero since you would not be able to mint
		pixelBalance.save();
	}

	const pixels = Account.load(minterId)!
	pixels.last_block = event.block.number
	pixels.save()
}
