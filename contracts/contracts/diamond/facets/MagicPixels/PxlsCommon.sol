// SPDX-License-Identifier: UNKNOWN
pragma solidity ^0.8.18;

import {Ownable} from "../../Ownable.sol";
import {LibPixels} from "../../libraries/LibPixels.sol";

contract PxlsCommon is Ownable {
	constructor() {}

	function pixelsOf(
		address addr,
		bytes calldata ids
	) external view returns (uint32[] memory result) {
		LibPixels.Storage storage store = LibPixels.store();

		mapping(bytes4 => uint32) storage pixelBalances = store.pixelMap[addr];

		uint256 len = ids.length / 4;

		result = new uint32[](len);

		for (uint i = 0; i < len; i++) {
			bytes4 pxlId = LibPixels.unpackFromAt(ids, i);
			result[i] = pixelBalances[pxlId];
		}
	}

	function price() external view returns (uint256) {
		return LibPixels.store().PRICE;
	}
}
