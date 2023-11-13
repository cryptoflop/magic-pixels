import {
	TradeClosed as TradeClosedEvent,
  TradeOpened as TradeOpenedEvent,
	TradeCanceled as TradeCanceledEvent
} from "../generated/Trades/TrdsCore"
import { Trade } from "../generated/schema"
import { store } from '@graphprotocol/graph-ts'


export function handleTradeOpened(event: TradeOpenedEvent): void {
	const tradeId = event.params.id.toHex()

	const trade = new Trade(tradeId);
	trade.creator = event.params.trade.creator;
	trade.receiver = event.params.trade.receiver;
	trade.pixels = event.params.trade.pixels;
	trade.price = event.params.trade.price;
	trade.tradeType = event.params.trade.tradeType;
	trade.save()
}

export function handleTradeClosed(event: TradeClosedEvent): void {
	const tradeId = event.params.id.toHex()

  store.remove('Trade', tradeId)
}

export function handleTradeCanceled(event: TradeCanceledEvent): void {
	const tradeId = event.params.id.toHex()
	
  store.remove('Trade', tradeId)
}
