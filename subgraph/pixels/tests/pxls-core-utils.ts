import { newMockEvent } from "matchstick-as"
import { ethereum, Address, Bytes } from "@graphprotocol/graph-ts"
import { Conjured } from "../generated/PxlsCore/PxlsCore"

export function createConjuredEvent(to: Address, pixels: Bytes): Conjured {
  let conjuredEvent = changetype<Conjured>(newMockEvent())

  conjuredEvent.parameters = new Array()

  conjuredEvent.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  )
  conjuredEvent.parameters.push(
    new ethereum.EventParam("pixels", ethereum.Value.fromBytes(pixels))
  )

  return conjuredEvent
}
