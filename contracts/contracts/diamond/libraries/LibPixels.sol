// SPDX-License-Identifier: UNKNOWN
pragma solidity ^0.8.18;

library LibPixels {
	bytes32 constant STORAGE_POSITION = keccak256("diamond.pixels.storage");

	struct Storage {
		uint8 MIN_PIXEL;
		uint8 MAX_PIXEL;
		uint8 PIXEL_DEPTH;
		address plts;
		uint256 UF_PROB; // 0.01%
		uint256 UF_PERC; // 10% percentage not the pill
		uint256 UF_LAST_BLOCK; // last block a unexpected find was made
		uint256 PRICE;
		uint24[] DEPTH_PROBS;
		mapping(address => mapping(bytes4 => uint32)) pixelMap;
	}

	function store() internal pure returns (Storage storage s) {
		bytes32 position = STORAGE_POSITION;
		assembly {
			s.slot := position
		}
	}

	/// @notice encodes a pixel with up to 4 colors into bytes
	function encode(uint8[] memory pxl) internal pure returns (bytes4 result) {
		return
			bytes4(
				(uint32(pxl.length > 0 ? pxl[0] : 0) << 24) |
					(uint32(pxl.length > 1 ? pxl[1] : 0) << 16) |
					(uint32(pxl.length > 2 ? pxl[2] : 0) << 8) |
					(uint32(pxl.length > 3 ? pxl[3] : 0))
			);
	}

	/// @notice decodes bytes into a pixel with up to 4 colors
	function decode(bytes4 pxl) internal pure returns (uint8[] memory result) {
		uint count = 0;
		for (uint i = 0; i < 4; i++) {
			if (uint8(bytes1(pxl << (i * 8))) != 0) {
				count++;
			}
		}

		result = new uint8[](count);

		for (uint i = 0; i < count; i++) {
			result[i] = uint8(bytes1(pxl << (i * 8)));
		}
	}

	/// @notice packs the bytes of a pixel into a byte array at the given positon
	function packIntoAt(bytes memory data, bytes4 pxl, uint256 at) internal pure {
		assembly {
			mstore(add(add(data, 0x20), mul(at, 0x04)), pxl)
		}
	}

	/// @notice unpacks the bytes of a pixel from a byte array at the given positon
	function unpackFromAt(
		bytes memory data,
		uint256 at
	) internal pure returns (bytes4 result) {
		assembly {
			result := mload(add(add(data, 0x20), mul(at, 0x04)))
		}
	}
}
