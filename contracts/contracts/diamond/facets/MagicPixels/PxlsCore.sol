// SPDX-License-Identifier: UNKNOWN
pragma solidity ^0.8.18;

import "./PxlsRng.sol";
import "./PxlsNether.sol";
import "../../../MagicPlates.sol";
import {LibDiamond} from "../../libraries/LibDiamond.sol";
import {LibPixels} from "../../libraries/LibPixels.sol";
import {LibPRNG} from "solady/src/utils/LibPRNG.sol";

contract PxlsCore {
	error Unauthorized();
	error InsufficientValue();

	constructor() {}

	event Conjured(address conjurer, bytes pixels);
	event Used(address user, bytes pixels);

	/// @notice Conjures random pixels from the nether
	function conjure(uint256 numPixels) external payable {
		LibPixels.Storage storage s = LibPixels.store();

		if (msg.value < (s.PRICE * numPixels)) revert InsufficientValue();

		LibPRNG.PRNG memory rnd = LibPRNG.PRNG(0);
		LibPRNG.seed(
			rnd,
			PxlsRng(LibDiamond.diamondStorage().diamondAddress).rnd(msg.sender)
		);

		mapping(bytes2 => uint32) storage pixels = s.pixelMap[msg.sender];

		bytes memory conjured = new bytes(numPixels * 2);

		// conjure actual pixels
		for (uint256 i = 0; i < numPixels; i++) {
			uint8 c1 = uint8(LibPRNG.next(rnd) % s.MAX_PIXEL) + s.MIN_PIXEL;
			uint8 c2;

			if (LibPRNG.next(rnd) % 10 >= 2) {
				// multicolor pixel
				uint8 idx = 0;
				while (idx == 0) {
					uint8 c = uint8(LibPRNG.next(rnd) % s.MAX_PIXEL) + s.MIN_PIXEL;
					if (c != c1) idx = c;
				}
				if (idx > c1) {
					c2 = idx;
				} else {
					c2 = c1;
					c1 = idx;
				}
			}

			bytes2 pxl = LibPixels.encode(c1, c2);
			LibPixels.packIntoAt(conjured, pxl, i);

			// Gas Notice: this will be zero to non-zero often and therefore
			// use a lot of gas as well as making the gas estimation inaccurate
			++pixels[pxl];
		}

		PxlsNether(LibDiamond.diamondStorage().diamondAddress).examineNether(
			msg.sender,
			numPixels / 8,
			LibPRNG.next(rnd)
		);

		emit Conjured(msg.sender, conjured);
	}

	/// @notice Uses pixels to mint a MagicPixels nft
	function mint(
		bytes16 name,
		bytes calldata pixels,
		bytes calldata delays
	) external {
		LibPixels.Storage storage s = LibPixels.store();

		// check name
		for (uint256 i = 0; i < name.length; i++) {
			if (
				!(name[i] >= bytes1("a") && name[i] <= bytes1("z")) &&
				!(name[i] >= bytes1("A") && name[i] <= bytes1("Z")) &&
				(name[i] != bytes1(0x0)) &&
				(name[i] != bytes1(" "))
			) {
				revert();
			}
		}

		mapping(bytes2 => uint32) storage pixelsOfOwner = s.pixelMap[msg.sender];

		// pixels
		uint256 len = pixels.length / 2;
		for (uint256 i = 0; i < len; i++) {
			bytes2 pxl = LibPixels.unpackFromAt(pixels, i);
			--pixelsOfOwner[pxl];
		}

		MagicPlates(s.plts).mint(msg.sender, name, pixels, delays);

		emit Used(msg.sender, pixels);
	}

	/// @dev restores pixels from a shattered plate
	function restore(address to, bytes calldata platePixels) external {
		LibPixels.Storage storage s = LibPixels.store();
		if (msg.sender != s.plts) revert Unauthorized();

		mapping(bytes2 => uint32) storage pixels = s.pixelMap[to];

		uint256 len = platePixels.length / 2;
		for (uint i = 0; i < len; i++) {
			bytes2 pxl = LibPixels.unpackFromAt(platePixels, i);
			++pixels[pxl];
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
}
