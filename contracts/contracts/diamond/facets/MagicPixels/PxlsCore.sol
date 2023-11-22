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

	/// @notice Conjures random pixels from the nether | 8,666,031 gas for 144 pxl
	function conjure(uint256 numPixels) external payable {
		LibPixels.Storage storage s = LibPixels.store();

		if (msg.value < (s.PRICE * numPixels)) revert InsufficientValue();

		LibPRNG.PRNG memory rnd = LibPRNG.PRNG(0);
		LibPRNG.seed(
			rnd,
			PxlsRng(LibDiamond.diamondStorage().diamondAddress).rnd(msg.sender)
		);

		mapping(bytes4 => uint32) storage pixels = s.pixelMap[msg.sender];

		bytes memory conjured = new bytes(numPixels * 4);

		// conjure actual pixels
		for (uint256 i = 0; i < numPixels; i++) {
			uint8 depth;
			uint256 pd = LibPRNG.next(rnd) % 100_000;
			for (uint256 j = 0; j < s.DEPTH_PROBS.length; j++) {
				if (pd <= s.DEPTH_PROBS[j]) {
					depth = uint8(j + 1);
					break;
				}
			}

			uint8[] memory pixel = new uint8[](depth);
			for (uint256 j = 0; j < depth; j++) {
				uint8 idx = 0;
				while (idx == 0) {
					uint8 candidate = uint8(LibPRNG.next(rnd) % s.MAX_PIXEL) +
						s.MIN_PIXEL;
					for (uint256 k = 0; k < pixel.length; k++) {
						if (candidate == pixel[k]) break;
						if (k == pixel.length - 1) idx = candidate;
					}
				}
				pixel[j] = idx;
			}
			if (depth > 1 && pixel[0] > pixel[1]) {
				// for now just switch
				uint8 tmp = pixel[0];
				pixel[0] = pixel[1];
				pixel[1] = tmp;
			}

			bytes4 pxlId = LibPixels.encode(pixel);
			LibPixels.packIntoAt(conjured, pxlId, i);

			// Gas Notice: this will be zero to non-zero often and therefore
			// use a lot of gas as well as making the gas estimation inaccurate
			++pixels[pxlId];
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
		bytes calldata pixelBytes,
		bytes calldata delayBytes
	) external {
		LibPixels.Storage storage s = LibPixels.store();

		mapping(bytes4 => uint32) storage pixelsOfOwner = s.pixelMap[msg.sender];

		uint8[][] memory pixels = new uint8[][](pixelBytes.length / 4);

		// pixels
		for (uint256 i = 0; i < pixels.length; i++) {
			bytes4 pxlId = LibPixels.unpackFromAt(pixelBytes, i);
			--pixelsOfOwner[pxlId];
			pixels[i] = LibPixels.decode(pxlId);
		}

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

		// delays
		uint16[][] memory delays = new uint16[][](delayBytes.length / 4);
		for (uint256 i = 0; i < delays.length; i++) {
			uint16[] memory delay = new uint16[](2);
			bytes4 b = LibPixels.unpackFromAt(delayBytes, i);
			delay[0] = uint16(bytes2(b));
			delay[1] = uint16(bytes2(b << 16));
			delays[i] = delay;
		}

		MagicPlates(s.plts).mint(msg.sender, name, pixels, delays);

		emit Used(msg.sender, pixelBytes);
	}

	/// @dev restores pixels from a shattered plate
	function restore(address to, uint8[][] calldata plate) external {
		LibPixels.Storage storage s = LibPixels.store();
		if (msg.sender != s.plts) revert Unauthorized();

		mapping(bytes4 => uint32) storage pixels = s.pixelMap[to];

		bytes memory restored = new bytes(plate.length * 4);

		for (uint i = 0; i < plate.length; i++) {
			bytes4 pxlId = LibPixels.encode(plate[i]);
			LibPixels.packIntoAt(restored, pxlId, i);
			++pixels[pxlId];
		}

		emit Conjured(to, restored);
	}

	function move(address from, address to, bytes memory pixelBytes) public {
		LibDiamond.enforceDiamondItself();
		LibPixels.Storage storage s = LibPixels.store();

		mapping(bytes4 => uint32) storage fromPixels = s.pixelMap[from];
		mapping(bytes4 => uint32) storage toPixels = s.pixelMap[to];

		uint256 len = (pixelBytes.length / 4);
		for (uint i = 0; i < len; i++) {
			bytes4 pxlId = LibPixels.unpackFromAt(pixelBytes, i);
			--fromPixels[pxlId];
			++toPixels[pxlId];
		}

		emit Used(from, pixelBytes);
		emit Conjured(to, pixelBytes);
	}
}
