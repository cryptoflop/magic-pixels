// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

library LibNFT {
	bytes32 constant STORAGE_POSITION = keccak256("diamond.plates.storage");

	struct Storage {
		uint test;
	}

	function store() internal pure returns (Storage storage s) {
		bytes32 position = STORAGE_POSITION;
		assembly {
			s.slot := position
		}
	}

}