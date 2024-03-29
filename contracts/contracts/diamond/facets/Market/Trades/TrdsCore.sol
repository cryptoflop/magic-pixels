// SPDX-License-Identifier: UNKNOWN
pragma solidity ^0.8.18;

import {LibDiamond} from "../../../libraries/LibDiamond.sol";
import {LibTrades} from "../../../libraries/LibTrades.sol";
import {SafeTransferLib} from "solady/src/utils/SafeTransferLib.sol";

import "../../../facets/MagicPixels/PxlsInternal.sol";

import "./TrdsVault.sol";

/// @notice facet that handles trades
contract TrdsCore {
	error Unauthorized();
	error IncorrectValue();
	error TradeAlreadyExists();

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
			SafeTransferLib.safeTransferETH(s.vault, msg.value);
		} else {
			// open as seller
			// decrease pixel balances from seller
			PxlsInternal(LibDiamond.diamondStorage().diamondAddress).decrease(
				tx.origin,
				pixels
			);
		}

		s.trades[id] = LibTrades.Trade(
			tx.origin,
			receiver,
			pixels,
			price,
			tradeType
		);

		emit TradeOpened(id, s.trades[id]);
	}

	function closeTrade(bytes32 id) external payable {
		LibTrades.Storage storage s = LibTrades.store();

		LibTrades.Trade memory trade = LibTrades.store().trades[id];

		if (tx.origin == trade.creator) revert Unauthorized();
		if (trade.receiver != address(0) && trade.receiver != tx.origin)
			revert Unauthorized();

		uint256 fee = (trade.price * 1) / 100; // 0.10% fee

		if (trade.tradeType == LibTrades.TradeType.BUY) {
			// close as seller

			// move pixels from the seller to the buyer
			PxlsInternal(LibDiamond.diamondStorage().diamondAddress).move(
				tx.origin,
				trade.creator,
				trade.pixels
			);
			deleteTrade(id);

			// send the trade price from the vault to the seller
			TrdsVault(s.vault).withdrawTo(tx.origin, trade.price - fee);
			// deduct fee
			TrdsVault(s.vault).withdrawTo(address(this), fee);
		} else {
			// close as buyer
			if (msg.value != trade.price) revert IncorrectValue();

			// increase pixel balances from buyer
			PxlsInternal(LibDiamond.diamondStorage().diamondAddress).increase(
				tx.origin,
				trade.pixels
			);
			deleteTrade(id);

			// send the trade price - fee to the seller
			SafeTransferLib.safeTransferETH(trade.creator, trade.price - fee);
		}

		emit TradeClosed(id, trade);
	}

	function cancelTrade(bytes32 id) external {
		LibTrades.Storage storage s = LibTrades.store();
		LibTrades.Trade memory trade = s.trades[id];
		if (trade.creator != tx.origin) revert Unauthorized();

		deleteTrade(id);

		if (trade.tradeType == LibTrades.TradeType.BUY) {
			// pay back price
			TrdsVault(s.vault).withdrawTo(trade.creator, trade.price);
		} else {
			// restore pixels
			PxlsInternal(LibDiamond.diamondStorage().diamondAddress).increase(
				trade.creator,
				trade.pixels
			);
		}

		emit TradeCanceled(id, trade);
	}

	function deleteTrade(bytes32 id) internal {
		delete LibTrades.store().trades[id];
	}
}
