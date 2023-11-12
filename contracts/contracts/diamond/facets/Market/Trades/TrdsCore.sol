// SPDX-License-Identifier: UNKNOWN
pragma solidity ^0.8.18;

import { LibDiamond } from "../../../libraries/LibDiamond.sol";
import { LibTrades } from "../../../libraries/LibTrades.sol";
import "../../../facets/MagicPixels/PxlsCore.sol";

import "./TrdsVault.sol";


/// @notice facet that handles trades and auctioning
contract TrdsCore {

	error Unauthorized();
	error PaymentFailed();
	error IncorrectValue();
	error TradeAlreadyExists();
	error SellerInsufficientPixels();

	constructor() {}

	event TradeOpened(bytes32 id, LibTrades.Trade trade);
	event TradeClosed(bytes32 id, LibTrades.Trade trade);
	event TradeCanceled(bytes32 id, LibTrades.Trade trade);

	function getTrade(bytes32 id) external view returns (LibTrades.Trade memory) {
		return LibTrades.store().trades[id];
	}

	function openTrade(
		address receiver,
		bytes calldata pixels,
		uint256 price,
		LibTrades.TradeType tradeType
	) external payable {
		LibTrades.Storage storage s = LibTrades.store();

		bytes32 id = keccak256(abi.encode(tx.origin, receiver, pixels));
		if (s.trades[id].pixels.length > 0) revert TradeAlreadyExists();
		if (pixels.length == 0) revert IncorrectValue();

		if (tradeType == LibTrades.TradeType.BUY) {
			// open as buyer
			if (msg.value != price) revert IncorrectValue();
			// send buy price to the vault
			(bool success, ) = s.vault.call{value: msg.value}("");
			if (!success) revert PaymentFailed();
		} else {
			// open as seller
			// move pixels from seller to vault
			PxlsCore(LibDiamond.diamondStorage().diamondAddress).movePixels(tx.origin, s.vault, pixels);
		}

		s.trades[id] = LibTrades.Trade(tx.origin, receiver, pixels, price, tradeType);

		emit TradeOpened(id, s.trades[id]);
	}

	function closeTrade(bytes32 id) external payable {
		LibTrades.Storage storage s = LibTrades.store();

		LibTrades.Trade memory trade = LibTrades.store().trades[id];

		if (trade.receiver != address(0) && trade.receiver != tx.origin) revert Unauthorized();

		if (trade.tradeType == LibTrades.TradeType.BUY) {
			// close as seller

			// move pixels from the seller to the buyer
			PxlsCore(LibDiamond.diamondStorage().diamondAddress).movePixels(tx.origin, trade.creator, trade.pixels);
			deleteTrade(id);

			// send the trade price from the vault to the seller
			bool success = TrdsVault(s.vault).withdrawTo(tx.origin, trade.price);
			if (!success) revert PaymentFailed();

		} else {
			// close as buyer
			if (msg.value != trade.price) revert IncorrectValue();

			// move pixels from vault to buyer
			PxlsCore(LibDiamond.diamondStorage().diamondAddress).movePixels(s.vault, tx.origin, trade.pixels);
			deleteTrade(id);

			// send the trade price to the seller
			(bool success, ) = trade.creator.call{value: trade.price}("");
			if (!success) revert PaymentFailed();

		}
		
		emit TradeClosed(id, trade);
	}

	function cancelTrade(bytes32 id) external {
			LibTrades.Trade memory trade = LibTrades.store().trades[id];
			if (trade.creator != tx.origin) revert Unauthorized();

			deleteTrade(id);

			if (trade.tradeType == LibTrades.TradeType.BUY) {
				// pay back price
				(bool success, ) = tx.origin.call{value: trade.price}("");
				if (!success) revert PaymentFailed();
			}

			emit TradeCanceled(id, trade);
	}

	function deleteTrade(bytes32 id) internal {
		LibTrades.Storage storage s = LibTrades.store();
		delete s.trades[id];
	}
}