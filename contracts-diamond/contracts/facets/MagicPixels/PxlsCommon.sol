// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import { Ownable } from "../../Ownable.sol";
import { LibPixels } from "./LibPixels.sol";

contract PxlsCommon is Ownable {

  constructor() {}

	function pixelsOf(address addr) external view returns (uint8[][] memory) {
		return LibPixels.store().pixelMap[addr];
	}

	function withdraw(uint256 amount) external onlyOwner returns (bool) {
		(bool success, ) = owner().call{value: amount}("");
		return success;
	}

}