// SPDX-License-Identifier: UNKNOWN
pragma solidity ^0.8.18;

library LibPixels {
	bytes32 constant STORAGE_POSITION = keccak256("diamond.pixels.storage");

	struct Storage {
		uint8 MIN_PIXEL;
		uint8 MAX_PIXEL;
		address plts;
		uint256 UF_PROB; // 0.01%
		uint256 UF_PERC; // 10% percentage not the pill
		uint256 UF_LAST_BLOCK; // last block a unexpected find was made
		uint256 PRICE;
		mapping(address => mapping(bytes2 => uint32)) pixelMap;
	}

	function store() internal pure returns (Storage storage s) {
		bytes32 position = STORAGE_POSITION;
		assembly {
			s.slot := position
		}
	}

	/// @notice encodes a pixel with up to 2 colors into bytes
	function encode(uint8 c1, uint8 c2) internal pure returns (bytes2 result) {
		return bytes2((uint16(c1) << 8) | (uint16(c2) << 0));
	}

	/// @notice decodes bytes into a pixel with up to 2 colors
	function decode(bytes2 pxl) internal pure returns (uint8 c1, uint8 c2) {
		return (uint8(bytes1(pxl << (0 * 8))), uint8(bytes1(pxl << (1 * 8))));
	}

	/// @notice packs the bytes of a pixel into a byte array at the given positon
	function packIntoAt(bytes memory data, bytes2 pxl, uint256 at) internal pure {
		assembly {
			mstore(add(add(data, 0x20), mul(at, 0x02)), pxl)
		}
	}

	/// @notice unpacks the bytes of a pixel from a byte array at the given positon
	function unpackFromAt(
		bytes memory data,
		uint256 at
	) internal pure returns (bytes2 result) {
		assembly {
			result := mload(add(add(data, 0x20), mul(at, 0x02)))
		}
	}
}
