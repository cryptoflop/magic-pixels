// SPDX-License-Identifier: UNKNOWN
pragma solidity ^0.8.18;

import { LibPixels } from "../../libraries/LibPixels.sol";
import { LibDiamond } from "../../libraries/LibDiamond.sol";
import { LibPRNG } from "solady/src/utils/LibPRNG.sol";

contract PxlsNether {

	event UnexpectedFind(address indexed to, uint256 amount);

  constructor() {}

	/// @notice searches the nether for other things than pixels...
	function examineNether(address examiner, uint256 thoroughness, uint256 seed) public {
		LibDiamond.enforceDiamondItself();
		LibPixels.Storage storage s = LibPixels.store();

		LibPRNG.PRNG memory rnd = LibPRNG.PRNG(0);
		LibPRNG.seed(rnd, seed);

		if (address(this).balance < 0.01 ether) { return; }
		if (block.number - s.UF_LAST_BLOCK < 10) { return; }
		
		uint256 b = uint256(LibPRNG.next(rnd) % s.UF_PROB);
		for (uint i = 0; i < thoroughness; i++) {
			uint256 w = uint256(LibPRNG.next(rnd) % s.UF_PROB);
			if (w == b) {
				uint256 eth = address(this).balance / s.UF_PERC;
				(bool success, ) = examiner.call{value: eth}("");
				if (success) {
					s.UF_LAST_BLOCK = block.number;
					emit UnexpectedFind(examiner, eth);
					return;
				}
			}
		}
	}

}