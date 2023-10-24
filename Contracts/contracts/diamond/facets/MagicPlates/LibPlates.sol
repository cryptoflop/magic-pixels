// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Counters.sol";

import { IMagicPixels } from "../MagicPixels/IMagicPixels.sol";

library LibPlates {
	bytes32 constant STORAGE_POSITION = keccak256("diamond.plates.storage");

	using Counters for Counters.Counter;

	struct Delay { uint256 idx; uint16 delay;}

	struct Storage {
		Counters.Counter _tokenIdCounter;

		mapping(uint256 => uint8[][]) plates;
		mapping(uint256 => Delay[]) pixelDelays;

		mapping(uint8 => string) pixelColors;

		uint96 fee;

		IMagicPixels mgcpxl;
	}

	function store() internal pure returns (Storage storage s) {
		bytes32 position = STORAGE_POSITION;
		assembly {
			s.slot := position
		}
	}

	function getNextTokenId() internal returns (uint256 tokenId) {
		Storage storage s = store();
		tokenId = s._tokenIdCounter.current();
		s._tokenIdCounter.increment();
	}

}