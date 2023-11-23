// SPDX-License-Identifier: UNKNOWN
pragma solidity ^0.8.18;

import {Ownable} from "../../Ownable.sol";
import {LibDiamond} from "../../libraries/LibDiamond.sol";
import {LibPixels} from "../../libraries/LibPixels.sol";
import "../../../MagicPlates.sol";

contract PxlsAdmin is Ownable {
	function withdraw(uint256 amount) external onlyOwner returns (bool) {
		(bool success, ) = owner().call{value: amount}("");
		return success;
	}

	function adminMint(
		bytes16 name,
		bytes calldata pixels,
		bytes calldata delays
	) external onlyOwner {
		LibPixels.Storage storage s = LibPixels.store();
		MagicPlates(s.plts).mint(msg.sender, name, pixels, delays);
	}
}
