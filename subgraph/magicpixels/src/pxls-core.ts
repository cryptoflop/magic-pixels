import {
  Conjured as ConjuredEvent,
  Minted as MintedEvent
} from "../generated/PxlsCore/PxlsCore"
import { Conjured, Minted } from "../generated/schema"

export function handleConjured(event: ConjuredEvent): void {
  let entity = new Conjured(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.conjurer = event.params.conjurer
  entity.pixels = event.params.pixels

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleMinted(event: MintedEvent): void {
  let entity = new Minted(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.minter = event.params.minter
  entity.pixels = event.params.pixels

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
