import {
	TradeClosed as TradeClosedEvent,
  TradeOpened as TradeOpenedEvent,
	TradeCanceled as TradeCanceledEvent
} from "../generated/Trades/AuctionHouse"
import { Trade, TradesByCreator, TradesByReceiver } from "../generated/schema"


export function handleTradeOpened(event: TradeOpenedEvent): void {
	const tradeId = event.params.id.toHex()

  const creator = event.transaction.from.toHex()
	const receiver = event.params.trade.receiver.toHex()

	let trade = Trade.load(tradeId)
	if (!trade) {
		trade = new Trade(tradeId);
	}
	trade.creator = event.params.trade.creator;
	trade.receiver = event.params.trade.receiver;
	trade.pixels = event.params.trade.pixels;
	trade.price = event.params.trade.price;
	trade.save()

  let tradesByCreator = TradesByCreator.load(creator)
	if (!tradesByCreator) {
		tradesByCreator = new TradesByCreator(creator);
    tradesByCreator.trades = [];
	}
	tradesByCreator.trades = tradesByCreator.trades.concat([tradeId])
  tradesByCreator.save()

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
  const creator = event.params.trade.creator.toHex()
	const receiver = event.params.closing.toHex()
	const tradeId = event.params.id.toHex()

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

export function handleTradeCanceled(event: TradeCanceledEvent): void {
	const creator = event.params.trade.creator.toHex()
	const receiver = event.params.trade.receiver.toHex()
	const tradeId = event.params.id.toHex()

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
