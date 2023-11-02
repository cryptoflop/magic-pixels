// SPDX-License-Identifier: UNKNOWN
pragma solidity ^0.8.18;

import { LibAuctionHouse } from "../../libraries/LibAuctionHouse.sol";
import { LibPixels } from "../../libraries/LibPixels.sol";


/// @notice module that handles trades and auctioning
contract AuctionHouse {

	error Unauthorized();
	error PaymentFailed();
	error IncorrectValue();
	error TradeAlreadyExists();
	error SellerInsufficientPixels();

	constructor() {}

	event TradeOpened(address indexed creator, address indexed receiver, bytes32 id);
	event TradeClosed(
		bytes32 id,
		address indexed seller,
		address indexed buyer,
		bytes4[] pixels
	);

	function getTrade(bytes32 id) external view returns (LibAuctionHouse.Trade memory) {
		return LibAuctionHouse.store().trades[id];
	}

	
	function openTrade(
		address receiver,
		bytes4[] calldata pixels,
		uint256 price,
		bool isSell
	) external payable {
		LibAuctionHouse.Storage storage s = LibAuctionHouse.store();

		bytes32 id = keccak256(abi.encode(tx.origin, receiver, pixels));
		if (s.trades[id].pixels.length > 0) revert TradeAlreadyExists();
		if (pixels.length == 0) revert IncorrectValue();

		if (isSell) {
			// open as seller
			s.trades[id] = LibAuctionHouse.Trade(tx.origin, receiver, pixels, price);
		} else {
			// open as buyer
			if (msg.value != price) revert IncorrectValue();
			s.trades[id] = LibAuctionHouse.Trade(receiver, tx.origin, pixels, price);
		}

		emit TradeOpened(tx.origin, receiver, id);
	}

	function closeTrade(bytes32 id, bool isSell) external payable {
		LibAuctionHouse.Trade memory trade = LibAuctionHouse.store().trades[id];

		if (isSell) {
			// close as seller
			if (trade.seller != address(0)) {
				if (trade.seller != tx.origin) revert Unauthorized();
			}

			movePixels(trade.pixels, tx.origin, trade.seller);

			(bool success, ) = tx.origin.call{value: trade.price}("");
			if (!success) revert PaymentFailed();

			emit TradeClosed(id, tx.origin, trade.buyer, trade.pixels);
		} else {
			// close as buyer
			if (msg.value != trade.price) revert IncorrectValue();

			if (trade.buyer != address(0)) {
				if (trade.buyer != tx.origin) revert Unauthorized();
			}

			(bool success, ) = trade.seller.call{value: trade.price}("");
			if (!success) revert PaymentFailed();
			
			movePixels(trade.pixels, trade.seller, tx.origin);

			emit TradeClosed(id, trade.seller, tx.origin, trade.pixels);
		}
	
		deleteTrade(id);
	}

	function cancelTrade(bytes32 id) external {
			LibAuctionHouse.Trade memory trade = LibAuctionHouse.store().trades[id];
			deleteTrade(id);
			if (trade.buyer == tx.origin) {
				// pay back price
				(bool success, ) = tx.origin.call{value: trade.price}("");
				if (!success) revert PaymentFailed();
			}
	}

	function deleteTrade(bytes32 id) internal {
		LibAuctionHouse.Storage storage s = LibAuctionHouse.store();
		delete s.trades[id];
	}

	function movePixels(
		bytes4[] memory pixels,
		address from,
		address to
	) internal {
		LibPixels.Storage storage s = LibPixels.store();

		mapping(bytes4 => uint32) storage fromPixels = s.pixelMap[from];
		mapping(bytes4 => uint32) storage toPixels = s.pixelMap[to];

		for (uint i = 0; i < pixels.length; i++) {
			bytes4 pxlId = pixels[i];
			--fromPixels[pxlId];
			++toPixels[pxlId];
		}
	}
}