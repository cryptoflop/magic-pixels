// SPDX-License-Identifier: UNKNOWN
pragma solidity ^0.8.18;

import {Ownable} from "../../Ownable.sol";
import {LibPixels} from "../../libraries/LibPixels.sol";

contract PxlsCommon is Ownable {
	constructor() {}

	function pixelsOf(
		address addr,
		bytes calldata pixels
	) external view returns (uint32[] memory result) {
		LibPixels.Storage storage store = LibPixels.store();

		mapping(bytes2 => uint32) storage pixelBalances = store.pixelMap[addr];

		uint256 len = pixels.length / 2;

		result = new uint32[](len);

		for (uint i = 0; i < len; i++) {
			bytes2 pxl = LibPixels.unpackFromAt(pixels, i);
			result[i] = pixelBalances[pxl];
		}
	}

	function price() external view returns (uint256) {
		return LibPixels.store().PRICE;
	}
}
