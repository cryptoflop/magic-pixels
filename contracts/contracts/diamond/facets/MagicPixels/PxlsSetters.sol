// SPDX-License-Identifier: UNKNOWN
pragma solidity ^0.8.18;

import {Ownable} from "../../Ownable.sol";
import {LibPixels} from "../../libraries/LibPixels.sol";

contract PxlsSetters is Ownable {
	constructor() {}

	function setMagicPlates(address plts) external onlyOwner {
		LibPixels.store().plts = plts;
	}

	function setMaxPixel(uint8 m) external onlyOwner {
		LibPixels.store().MAX_PIXEL = m;
	}

	function setPrice(uint256 p) external onlyOwner {
		LibPixels.store().PRICE = p;
	}

	function setUF(uint256 prob, uint256 perc) external onlyOwner {
		LibPixels.store().UF_PROB = prob;
		LibPixels.store().UF_PERC = perc;
	}
}
