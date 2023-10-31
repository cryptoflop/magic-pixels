import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address, Bytes } from "@graphprotocol/graph-ts"
import { TradeClosed } from "../generated/schema"
import { TradeClosed as TradeClosedEvent } from "../generated/AuctionHouse/AuctionHouse"
import { handleTradeClosed } from "../src/auction-house"
import { createTradeClosedEvent } from "./auction-house-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let seller = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let buyer = Address.fromString("0x0000000000000000000000000000000000000001")
    let pixels = [Bytes.fromI32(1234567890)]
    let newTradeClosedEvent = createTradeClosedEvent(seller, buyer, pixels)
    handleTradeClosed(newTradeClosedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("TradeClosed created and stored", () => {
    assert.entityCount("TradeClosed", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "TradeClosed",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "seller",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "TradeClosed",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "buyer",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "TradeClosed",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "pixels",
      "[1234567890]"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
