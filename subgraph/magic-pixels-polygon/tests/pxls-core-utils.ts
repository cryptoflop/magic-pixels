import { newMockEvent } from "matchstick-as"
import { ethereum, Address, Bytes } from "@graphprotocol/graph-ts"
import { Conjured, Used } from "../generated/PxlsCore/PxlsCore"

export function createConjuredEvent(
  conjurer: Address,
  pixels: Bytes
): Conjured {
  let conjuredEvent = changetype<Conjured>(newMockEvent())

  conjuredEvent.parameters = new Array()

  conjuredEvent.parameters.push(
    new ethereum.EventParam("conjurer", ethereum.Value.fromAddress(conjurer))
  )
  conjuredEvent.parameters.push(
    new ethereum.EventParam("pixels", ethereum.Value.fromBytes(pixels))
  )

  return conjuredEvent
}

export function createUsedEvent(user: Address, pixels: Bytes): Used {
  let usedEvent = changetype<Used>(newMockEvent())

  usedEvent.parameters = new Array()

  usedEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
  )
  usedEvent.parameters.push(
    new ethereum.EventParam("pixels", ethereum.Value.fromBytes(pixels))
  )

  return usedEvent
}
