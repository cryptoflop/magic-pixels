// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

library LibAuctionHouse {
	bytes32 constant STORAGE_POSITION = keccak256("diamond.auctionhouse.storage");

	struct Trade {
		address seller;
		address buyer;
		uint8[][] pixels;
		uint256 price;
	}

	struct Storage {
		mapping(bytes32 => Trade) trades;
		mapping(address => bytes32[]) tradesBySeller;
	}

	function store() internal pure returns (Storage storage s) {
		bytes32 position = STORAGE_POSITION;
		assembly {
			s.slot := position
		}
	}

}