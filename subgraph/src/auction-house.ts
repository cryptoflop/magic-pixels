import {
  TradeClosed as TradeClosedEvent,
  TradeOpened as TradeOpenedEvent
} from "../generated/Trades/AuctionHouse"
import { TradesByCreator, TradesByReceiver } from "../generated/schema"


export function handleTradeOpened(event: TradeOpenedEvent): void {
	const tradeId = event.params.id

  const creator = event.transaction.from.toHex()

  let tradesByCreator = TradesByCreator.load(creator)
	if (!tradesByCreator) {
		tradesByCreator = new TradesByCreator(creator);
    tradesByCreator.trades = [];
	}
	tradesByCreator.trades = tradesByCreator.trades.concat([tradeId])
  tradesByCreator.save()

	const receiver = event.params.receiver.toHex()
	
	if (receiver && receiver != "0x0000000000000000000000000000000000000000") {
		let tradesByReceiver = TradesByReceiver.load(receiver)
		if (!tradesByReceiver) {
			tradesByReceiver = new TradesByReceiver(receiver);
			tradesByReceiver.trades = [];
		}
		tradesByReceiver.trades = tradesByReceiver.trades.concat([tradeId])
		tradesByReceiver.save()
	}
}

export function handleTradeClosed(event: TradeClosedEvent): void {
	const receiver = event.transaction.from.toHex()
  const creator = (receiver == event.params.seller.toHex() ? event.params.buyer : event.params.seller).toHex()
	const tradeId = event.params.id

  const tradesByCreator = TradesByCreator.load(creator)!
	const idxC = tradesByCreator.trades.indexOf(tradeId)
  tradesByCreator.trades.splice(idxC, 1)
	tradesByCreator.trades = tradesByCreator.trades.slice(0)
	tradesByCreator.save()
	
	const tradesByReceiver = TradesByReceiver.load(receiver)
	if (tradesByReceiver) {
		const idxR = tradesByReceiver.trades.indexOf(tradeId)
		if (idxR > -1) {
			tradesByReceiver.trades.splice(idxR, 1)
			tradesByReceiver.trades = tradesByReceiver.trades.slice(0)
			tradesByReceiver.save()
		}
	}
}
