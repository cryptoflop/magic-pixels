import { newMockEvent } from "matchstick-as"
import { ethereum, Address, Bytes } from "@graphprotocol/graph-ts"
import { Conjured, Minted } from "../generated/PxlsCore/PxlsCore"

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

export function createMintedEvent(minter: Address, pixels: Bytes): Minted {
  let mintedEvent = changetype<Minted>(newMockEvent())

  mintedEvent.parameters = new Array()

  mintedEvent.parameters.push(
    new ethereum.EventParam("minter", ethereum.Value.fromAddress(minter))
  )
  mintedEvent.parameters.push(
    new ethereum.EventParam("pixels", ethereum.Value.fromBytes(pixels))
  )

  return mintedEvent
}
