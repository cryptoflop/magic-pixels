// SPDX-License-Identifier: UNKNOWN
pragma solidity ^0.8.18;

import { LibAuctionHouse } from "./LibAuctionHouse.sol";
import { LibPixels } from "../MagicPixels/LibPixels.sol";

/// @notice module that handles trades and auctioning
contract AuctionHouse {

	event TradeOpened(address indexed seller, bytes32 id);
	event TradeClosed(
		address indexed seller,
		address indexed buyer,
		uint8[][] pixels
	);

	function getTrade(bytes32 id) external view returns (LibAuctionHouse.Trade memory) {
		return LibAuctionHouse.store().trades[id];
	}

	function getTrades(address seller) external view returns (bytes32[] memory) {
		return LibAuctionHouse.store().tradesBySeller[seller];
	}

	
	function openTrade(
		address buyer,
		uint8[][] calldata pixels,
		uint256 price
	) external payable {
		LibAuctionHouse.Storage storage s = LibAuctionHouse.store();

		bytes32 id = keccak256(abi.encode(tx.origin, buyer, pixels));
		require(s.trades[id].seller == address(0), "trade already exists");

		if (msg.value == 0) {
			// open as seller
			s.trades[id] = LibAuctionHouse.Trade(tx.origin, buyer, pixels, price);
		} else {
			// open as buyer
			require(msg.value == price, "incorrect eth amount");
			s.trades[id] = LibAuctionHouse.Trade(buyer, tx.origin, pixels, price);
		}

		s.tradesBySeller[tx.origin].push(id);
		emit TradeOpened(tx.origin, id);
	}

	function closeTrade(bytes32 id) external payable {
		LibAuctionHouse.Trade memory trade = LibAuctionHouse.store().trades[id];

		if (msg.value == 0) {
			// close as seller
			if (trade.seller != address(0)) {
				require(trade.seller == tx.origin, "not authorized");
			}

			movePixels(trade.pixels, tx.origin, trade.seller);

			(bool success, ) = tx.origin.call{value: trade.price}("");
			require(success, "payment failed");
		} else {
			// close as buyer
			require(msg.value == trade.price, "incorrect eth amount");
			if (trade.buyer != address(0)) {
				require(trade.buyer == tx.origin, "not authorized");
			}

			(bool success, ) = trade.seller.call{value: trade.price}("");
			require(success, "payment failed");
			
			movePixels(trade.pixels, trade.seller, tx.origin);
		}
	
		deleteTrade(id);
		emit TradeClosed(trade.seller, tx.origin, trade.pixels);
	}

	function cancelTrade(bytes32 id) external {
			LibAuctionHouse.Trade memory trade = LibAuctionHouse.store().trades[id];
			deleteTrade(id);
			if (trade.buyer == tx.origin) {
				// pay back price
				(bool success, ) = tx.origin.call{value: trade.price}("");
				require(success, "payment failed");
			}
	}

	function deleteTrade(bytes32 id) internal {
		LibAuctionHouse.Storage storage s = LibAuctionHouse.store();
		bytes32[] storage bySelf = s.tradesBySeller[tx.origin];
		
		uint256 idx;
		for (uint256 i = 0; i < bySelf.length; i++) {
			if (bySelf[i] == id) {
				idx = i;
				break;
			}
			if ((i + 1) == bySelf.length) {
				revert("not authorized");
			}
		}

		if (bySelf.length > 1) {
			bySelf[idx] = bySelf[bySelf.length - 1];
		}
		bySelf.pop();

		delete s.trades[id];
	}

	function movePixels(
		uint8[][] memory pixels,
		address from,
		address to
	) internal {
		LibPixels.Storage storage s = LibPixels.store();

		uint8[][] storage fromPixels = s.pixelMap[from];
		uint8[][] storage toPixels = s.pixelMap[to];

		for (uint i = 0; i < pixels.length; i++) {
			uint8[] memory pixel = pixels[i];
			
			uint256 idx = fromPixels.length;
			for (uint j = 0; j < fromPixels.length; j++) {
				uint8[] memory p = fromPixels[i];
				bool equal = true;
				for (uint k = 0; k < pixel.length; k++) {
					if (pixel[k] != p[k]) {
						equal = false;
						break;
					}
				}
				if (equal) {
					idx = j;
					break;
				}
			}
			if (idx == fromPixels.length) {
				revert("seller does not own all pixels.");
			}

			toPixels.push(fromPixels[idx]);
			uint256 len = pixels.length - 1;
			if (idx < len) {
				fromPixels[idx] = fromPixels[len];
			}
			fromPixels.pop();
		}

	}
}