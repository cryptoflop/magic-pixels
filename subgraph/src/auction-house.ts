import {
  TradeClosed as TradeClosedEvent,
  TradeOpened as TradeOpenedEvent
} from "../generated/AuctionHouse/AuctionHouse"
import { TradeClosed, TradeOpened } from "../generated/schema"

export function handleTradeClosed(event: TradeClosedEvent): void {
  let entity = new TradeClosed(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.seller = event.params.seller
  entity.buyer = event.params.buyer
  entity.pixels = event.params.pixels

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTradeOpened(event: TradeOpenedEvent): void {
  let entity = new TradeOpened(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.creator = event.params.creator
  entity.AuctionHouse_id = event.params.id

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
