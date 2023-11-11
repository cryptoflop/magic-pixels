// SPDX-License-Identifier: UNKNOWN
pragma solidity ^0.8.18;

import { LibAuctionHouse } from "../../libraries/LibAuctionHouse.sol";
import { LibPixels } from "../../libraries/LibPixels.sol";


/// @notice facet that handles trades and auctioning
contract AuctionHouse {

	error Unauthorized();
	error PaymentFailed();
	error IncorrectValue();
	error TradeAlreadyExists();
	error SellerInsufficientPixels();

	constructor() {}

	event TradeOpened(bytes32 id, LibAuctionHouse.Trade trade);
	event TradeClosed(bytes32 id, LibAuctionHouse.Trade trade, address closing);
	event TradeCanceled(bytes32 id, LibAuctionHouse.Trade trade);

	function getTrade(bytes32 id) external view returns (LibAuctionHouse.Trade memory) {
		return LibAuctionHouse.store().trades[id];
	}

	function openTrade(
		address receiver,
		bytes calldata pixels,
		uint256 price,
		LibAuctionHouse.TradeType tradeType
	) external payable {
		LibAuctionHouse.Storage storage s = LibAuctionHouse.store();

		bytes32 id = keccak256(abi.encode(tx.origin, receiver, pixels));
		if (s.trades[id].pixels.length > 0) revert TradeAlreadyExists();
		if (pixels.length == 0) revert IncorrectValue();

		if (tradeType == LibAuctionHouse.TradeType.BUY) {
			// open as buyer
			if (msg.value != price) revert IncorrectValue();
		}

		s.trades[id] = LibAuctionHouse.Trade(tx.origin, receiver, pixels, price, tradeType);

		emit TradeOpened(id, s.trades[id]);
	}

	function closeTrade(bytes32 id) external payable {
		LibAuctionHouse.Trade memory trade = LibAuctionHouse.store().trades[id];

		if (trade.receiver != address(0) && trade.receiver != tx.origin) revert Unauthorized();

		if (trade.tradeType == LibAuctionHouse.TradeType.BUY) {
			// close as seller
			movePixels(trade.pixels, tx.origin, trade.creator);
			deleteTrade(id);

			(bool success, ) = tx.origin.call{value: trade.price}("");
			if (!success) revert PaymentFailed();

		} else {
			// close as buyer
			if (msg.value != trade.price) revert IncorrectValue();

			movePixels(trade.pixels, trade.creator, tx.origin);
			deleteTrade(id);

			(bool success, ) = trade.creator.call{value: trade.price}("");
			if (!success) revert PaymentFailed();

		}
		
		emit TradeClosed(id, trade, tx.origin);
	}

	function cancelTrade(bytes32 id) external {
			LibAuctionHouse.Trade memory trade = LibAuctionHouse.store().trades[id];
			if (trade.creator != tx.origin) revert Unauthorized();

			deleteTrade(id);

			if (trade.tradeType == LibAuctionHouse.TradeType.BUY) {
				// pay back price
				(bool success, ) = tx.origin.call{value: trade.price}("");
				if (!success) revert PaymentFailed();
			}

			emit TradeCanceled(id, trade);
	}

	function deleteTrade(bytes32 id) internal {
		LibAuctionHouse.Storage storage s = LibAuctionHouse.store();
		delete s.trades[id];
	}

	function movePixels(
		bytes memory pixelBytes,
		address from,
		address to
	) internal {
		LibPixels.Storage storage s = LibPixels.store();

		mapping(bytes4 => uint32) storage fromPixels = s.pixelMap[from];
		mapping(bytes4 => uint32) storage toPixels = s.pixelMap[to];

		uint256 len = (pixelBytes.length / 4);
		for (uint i = 0; i < len; i++) {
			bytes4 pxlId = LibPixels.unpackFromAt(pixelBytes, i);
			--fromPixels[pxlId];
			++toPixels[pxlId];
		}
	}
}