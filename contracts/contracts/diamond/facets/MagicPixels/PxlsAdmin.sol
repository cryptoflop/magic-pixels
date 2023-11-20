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
		bytes calldata pixelBytes,
		uint16[][] memory delays
	) external onlyOwner {
		LibPixels.Storage storage s = LibPixels.store();

		uint8[][] memory pixels = new uint8[][](pixelBytes.length / 4);

		for (uint i = 0; i < pixels.length; i++) {
			bytes4 pxlId = LibPixels.unpackFromAt(pixelBytes, i);
			pixels[i] = LibPixels.decode(pxlId);
		}

		MagicPlates(s.plts).mint(msg.sender, name, pixels, delays);
	}
}
