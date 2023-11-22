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
		bytes calldata delayBytes
	) external onlyOwner {
		LibPixels.Storage storage s = LibPixels.store();

		uint8[][] memory pixels = new uint8[][](pixelBytes.length / 4);

		for (uint i = 0; i < pixels.length; i++) {
			bytes4 pxlId = LibPixels.unpackFromAt(pixelBytes, i);
			pixels[i] = LibPixels.decode(pxlId);
		}

		uint16[][] memory delays = new uint16[][](delayBytes.length / 4);
		for (uint256 i = 0; i < delays.length; i++) {
			uint16[] memory delay = new uint16[](2);
			bytes4 b = LibPixels.unpackFromAt(delayBytes, i);
			delay[0] = uint16(bytes2(b));
			delay[1] = uint16(bytes2(b << 16));
			delays[i] = delay;
		}

		MagicPlates(s.plts).mint(msg.sender, name, pixels, delays);
	}
}
