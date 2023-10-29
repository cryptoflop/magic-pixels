// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import { Ownable } from "../../Ownable.sol";
import { LibPixels } from "../../libraries/LibPixels.sol";

contract PxlsCommon is Ownable {

  constructor() {}

	/// @notice TODO
	function pixelsOf(address addr) external view returns (uint8[][] memory result) {
		LibPixels.Storage storage store = LibPixels.store();

		mapping(bytes4 => uint32) storage pixels = store.pixelMap[addr];

		// uint8 MAX_PIXEL = store.MAX_PIXEL;
		// for (uint8 i = store.MIN_PIXEL; i < MAX_PIXEL; i++) {
		// 	uint8[] memory pxl = new uint8[](1);
		// 	pxl[0] = i;
		// 	bytes4 pxlId = LibPixels.encode(pxl);


		// 	for (uint8 j = store.MIN_PIXEL; j < MAX_PIXEL; j++) {
		// 		uint8[] memory pxl = new uint8[](2);
		// 		pxl[0] = i; pxl[1] = j;
		// 		bytes4 pxlId = LibPixels.encode(pxl);

		// 	}
		// }
		return new uint8[][](0);
	}

	function withdraw(uint256 amount) external onlyOwner returns (bool) {
		(bool success, ) = owner().call{value: amount}("");
		return success;
	}

}