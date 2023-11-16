import {
  Conjured as ConjuredEvent,
  Used as UsedEvent
} from "../generated/PxlsCore/PxlsCore"
import { Conjured, Used } from "../generated/schema"

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

export function handleUsed(event: UsedEvent): void {
  let entity = new Used(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.user = event.params.user
  entity.pixels = event.params.pixels

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
