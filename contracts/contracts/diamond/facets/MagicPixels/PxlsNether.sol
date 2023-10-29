// SPDX-License-Identifier: UNKNOWN
pragma solidity ^0.8.18;

import { LibPixels } from "../../libraries/LibPixels.sol";
import { LibDiamond } from "../../libraries/LibDiamond.sol";

contract PxlsNether {

	event UnexpectedFind(address indexed to, uint256 amount);

  constructor() {}

	/// @notice searches the nether for other things than pixels...
	function examineNether(address examiner, uint256 thoroughness, uint256 rnd) public {
		LibDiamond.enforceDiamondItself();
		LibPixels.Storage storage s = LibPixels.store();

		if (address(this).balance < 0.01 ether) { return; }
		if (block.number - s.ETH_LAST_BLOCK < 10) { return; }
		
		uint256 b = uint256(rnd % s.ETH_PROB);
		for (uint i = 0; i < thoroughness; i++) {
			uint256 w = uint256(uint256(keccak256(abi.encodePacked(rnd, i * 321))) % s.ETH_PROB);
			if (w == b) {
				uint256 eth = address(this).balance / s.ETH_PERC;
				(bool success, ) = examiner.call{value: eth}("");
				if (success) {
					s.ETH_LAST_BLOCK = block.number;
					emit UnexpectedFind(examiner, eth);
					return;
				}
			}
		}
	}

}