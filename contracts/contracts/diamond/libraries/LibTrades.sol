// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

library LibTrades {
	bytes32 constant STORAGE_POSITION = keccak256("diamond.trades.storage");

	enum TradeType { SELL, BUY }

	struct Trade {
		address creator;
		address receiver;
		bytes pixels;
		uint256 price;
		TradeType tradeType;
	}

	struct Storage {
		mapping(bytes32 => Trade) trades;
		address payable vault;
	}

	function store() internal pure returns (Storage storage s) {
		bytes32 position = STORAGE_POSITION;
		assembly {
			s.slot := position
		}
	}

}