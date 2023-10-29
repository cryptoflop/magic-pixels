// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import { IMagicPlates } from "../facets/MagicPlates/IMagicPlates.sol";

library LibPixels {
	bytes32 constant STORAGE_POSITION = keccak256("diamond.pixels.storage");

	struct Storage {
		uint8 PLATE_SIZE;
		uint8 MIN_PIXEL;
		uint8 MAX_PIXEL;
		uint8 PIXEL_DEPTH;

		uint256 ETH_PROB; // 0.01%
		uint256 ETH_PERC; // 10% percentage not the pill
		uint256 ETH_LAST_BLOCK; // last block eth was found

		uint256 PRICE;

		uint24[] DEPTH_PROBS;

		mapping(address => mapping(bytes4 => uint32)) pixelMap;

		IMagicPlates nft;
	}

	function store() internal pure returns (Storage storage s) {
		bytes32 position = STORAGE_POSITION;
		assembly {
			s.slot := position
		}
	}

	/// @notice encodes a pixel with up to 4 colors into bytes
	function encode(uint8[] memory pxl) public pure returns(bytes4 result) {
		return bytes4(
			(uint32(pxl.length > 0 ? pxl[0] : 0) << 24) |
			(uint32(pxl.length > 1 ? pxl[1] : 0) << 16) |
			(uint32(pxl.length > 2 ? pxl[2] : 0) << 8) |
			(uint32(pxl.length > 3 ? pxl[3] : 0))
		);
	}

	/// @notice decodes bytes into a pixel with up to 4 colors
	function decode(bytes4 pxl) public pure returns (uint8[] memory result) {
		uint count = 0;
		for (uint i = 0; i < 4; i++) {
			if (uint8(uint8(bytes1(pxl << (i * 8)))) != 0) {
				count++;
			}
		}
		
		result = new uint8[](count);

		for (uint i = 0; i < count; i++) {
			result[i] = uint8(bytes1(pxl << (i * 8)));
		}
	}

}