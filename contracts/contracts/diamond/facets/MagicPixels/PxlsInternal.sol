// SPDX-License-Identifier: UNKNOWN
pragma solidity ^0.8.18;

import "./PxlsRng.sol";
import "./PxlsNether.sol";
import "../../../MagicPlates.sol";
import {LibDiamond} from "../../libraries/LibDiamond.sol";
import {LibPixels} from "../../libraries/LibPixels.sol";

contract PxlsInternal {
	constructor() {}

	event Conjured(address conjurer, bytes pixels);
	event Used(address user, bytes pixels);

	function restore(address to, bytes calldata platePixels) external {
		LibPixels.Storage storage s = LibPixels.store();
		assert(msg.sender == s.plts);

		mapping(bytes2 => uint32) storage balances = s.pixelMap[to];

		uint256 len = (platePixels.length / 2);
		for (uint256 i = 0; i < len; i++) {
			bytes2 pxl = LibPixels.unpackFromAt(platePixels, i);
			++balances[pxl];
		}

		emit Conjured(to, platePixels);
	}

	function move(address from, address to, bytes memory pixels) public {
		LibDiamond.enforceDiamondItself();
		LibPixels.Storage storage s = LibPixels.store();

		mapping(bytes2 => uint32) storage fromPixels = s.pixelMap[from];
		mapping(bytes2 => uint32) storage toPixels = s.pixelMap[to];

		uint256 len = (pixels.length / 2);
		for (uint256 i = 0; i < len; i++) {
			bytes2 pxl = LibPixels.unpackFromAt(pixels, i);
			--fromPixels[pxl];
			++toPixels[pxl];
		}

		emit Used(from, pixels);
		emit Conjured(to, pixels);
	}

	function increase(address owner, bytes memory pixels) public {
		LibDiamond.enforceDiamondItself();
		LibPixels.Storage storage s = LibPixels.store();

		mapping(bytes2 => uint32) storage balances = s.pixelMap[owner];

		uint256 len = (pixels.length / 2);
		for (uint256 i = 0; i < len; i++) {
			bytes2 pxl = LibPixels.unpackFromAt(pixels, i);
			++balances[pxl];
		}

		emit Conjured(owner, pixels);
	}

	function decrease(address owner, bytes memory pixels) public {
		LibDiamond.enforceDiamondItself();
		LibPixels.Storage storage s = LibPixels.store();

		mapping(bytes2 => uint32) storage balances = s.pixelMap[owner];

		uint256 len = (pixels.length / 2);
		for (uint256 i = 0; i < len; i++) {
			bytes2 pxl = LibPixels.unpackFromAt(pixels, i);
			--balances[pxl];
		}

		emit Used(owner, pixels);
	}
}
