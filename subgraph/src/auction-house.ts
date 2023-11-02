import {
  TradeClosed as TradeClosedEvent,
  TradeOpened as TradeOpenedEvent
} from "../generated/Trades/AuctionHouse"
import { TradesByCreator, TradesByReceiver } from "../generated/schema"

function TradesOrDefault(Trades: any, id: string): any {
	let trades = Trades.load(id)
	if (!trades) {
		trades = new Trades(id);
    trades.trades = [];
	}
	return trades
}

export function handleTradeOpened(event: TradeOpenedEvent): void {
	const tradeId = event.params.id

  const creator = event.transaction.from.toHex()

  const tradesByCreator = TradesOrDefault(TradesByCreator, creator)
	tradesByCreator.trades.push(tradeId)
  tradesByCreator.save()

	const receiver = event.params.receiver.toHex()
	
	if (receiver && receiver != "0x0000000000000000000000000000000000000000") {
		const tradesByReceiver = TradesOrDefault(TradesByReceiver, receiver)
		tradesByReceiver.trades.push(tradeId)
		tradesByReceiver.save()
	}
}

export function handleTradeClosed(event: TradeClosedEvent): void {
	const receiver = event.transaction.from.toHex()
  const creator = (receiver == event.params.seller.toHex() ? event.params.buyer : event.params.seller).toHex()
	const tradeId = event.params.id

  const tradesByCreator = TradesOrDefault(TradesByCreator, creator)
	const idxC = tradesByCreator.trades.indexOf(tradeId)!
  tradesByCreator.trades.splice(idxC, 1)
	tradesByCreator.save()
	
	const tradesByReceiver = TradesOrDefault(TradesByReceiver, receiver)
	const idxR = tradesByReceiver.trades.push(tradeId)
	if (idxR > -1) {
		tradesByReceiver.trades.splice(idxR, 1)
		tradesByReceiver.save()
	}
}
