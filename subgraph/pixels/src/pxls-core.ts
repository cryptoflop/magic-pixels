import { Conjured as ConjuredEvent } from "../generated/PxlsCore/PxlsCore"
import { Conjured } from "../generated/schema"

export function handleConjured(event: ConjuredEvent): void {
  let entity = new Conjured(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.to = event.params.to
  entity.pixels = event.params.pixels

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
