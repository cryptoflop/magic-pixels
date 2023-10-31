import { newMockEvent } from "matchstick-as"
import { ethereum, Address, Bytes } from "@graphprotocol/graph-ts"
import {
  TradeClosed,
  TradeOpened
} from "../generated/AuctionHouse/AuctionHouse"

export function createTradeClosedEvent(
  seller: Address,
  buyer: Address,
  pixels: Array<Bytes>
): TradeClosed {
  let tradeClosedEvent = changetype<TradeClosed>(newMockEvent())

  tradeClosedEvent.parameters = new Array()

  tradeClosedEvent.parameters.push(
    new ethereum.EventParam("seller", ethereum.Value.fromAddress(seller))
  )
  tradeClosedEvent.parameters.push(
    new ethereum.EventParam("buyer", ethereum.Value.fromAddress(buyer))
  )
  tradeClosedEvent.parameters.push(
    new ethereum.EventParam(
      "pixels",
      ethereum.Value.fromFixedBytesArray(pixels)
    )
  )

  return tradeClosedEvent
}

export function createTradeOpenedEvent(
  creator: Address,
  id: Bytes
): TradeOpened {
  let tradeOpenedEvent = changetype<TradeOpened>(newMockEvent())

  tradeOpenedEvent.parameters = new Array()

  tradeOpenedEvent.parameters.push(
    new ethereum.EventParam("creator", ethereum.Value.fromAddress(creator))
  )
  tradeOpenedEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromFixedBytes(id))
  )

  return tradeOpenedEvent
}
