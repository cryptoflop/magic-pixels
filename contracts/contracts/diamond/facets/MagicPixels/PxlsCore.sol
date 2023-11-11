// SPDX-License-Identifier: UNKNOWN
pragma solidity ^0.8.18;

import "./PxlsRng.sol";
import "./PxlsNether.sol";
import "../../../MagicPlates.sol";
import { LibDiamond } from "../../libraries/LibDiamond.sol";
import { LibPixels } from "../../libraries/LibPixels.sol";

contract PxlsCore {

	error Unauthorized();
	error InvalidIndicies();
	error InsufficientValue();
	error InsufficientPixels();

  constructor() {}

	event Conjured(address conjurer, bytes pixels);
	event Minted(address minter, bytes pixels);

	/// @notice Conjures random pixels from the nether | 8,666,031 gas for 144 pxl
	function conjure(uint256 numPixels) external payable {
		LibPixels.Storage storage s = LibPixels.store();

		if (msg.value < (s.PRICE * numPixels)) revert InsufficientValue();

		uint256 rnd = PxlsRng(LibDiamond.diamondStorage().diamondAddress).rnd(msg.sender);

		mapping(bytes4 => uint32) storage pixels = s.pixelMap[msg.sender];

		bytes memory conjured = new bytes(numPixels * 4);

		// conjure actual pixels
		for (uint i = 0; i < numPixels; i++) {
			uint256 rndI = uint256(keccak256(abi.encodePacked(rnd, i + 1)));

			uint8 depth;
			uint256 pd = rndI % 100_000;
			for (uint j = 0; j < s.DEPTH_PROBS.length; j++) {
				if (pd <= s.DEPTH_PROBS[j]) {
					// set the depth of the pixel to the idx where "pd" falls in DEPTH_PROBS
					depth = uint8(j + 1);
					break;
				}
			}

			uint8[] memory pixel = new uint8[](depth);
			uint8 last = 0;
			for (uint j = 0; j < depth; j++) {
				// this formular respects a couple of things:
				// - a uint8 thats "random" based on a seed
				// - a uint8 higher than the preceeding one
				// - a uint8 between MIN_PIXEL - MAX_PIXEL (both inclusive)
				// - a uint8 that can't be MAX_PIXEL if it's not the last entry
				last = last + uint8((uint256(keccak256(abi.encodePacked(rndI, j)))) % ((s.MAX_PIXEL - ((depth - 1) - j)) - last)) + s.MIN_PIXEL;
				pixel[j] = last;
			}

			bytes4 pxlId = LibPixels.encode(pixel);
			LibPixels.packIntoAt(conjured, pxlId, i);
			++pixels[pxlId];
		}

		PxlsNether(LibDiamond.diamondStorage().diamondAddress).examineNether(msg.sender, numPixels / 8, rnd);
		
		emit Conjured(msg.sender, conjured);
	}

	/// @notice Uses pixels to mint a MagicPixels nft
	function mint(bytes calldata pixelBytes, uint32[][] memory delays) external {
		LibPixels.Storage storage s = LibPixels.store();

		mapping(bytes4 => uint32) storage pixelsOfOwner = s.pixelMap[msg.sender];

		uint8[][] memory pixels = new uint8[][](pixelBytes.length / 4);

		// subtract pixels
		for (uint i = 0; i < pixels.length; i++) {
			bytes4 pxlId = LibPixels.unpackFromAt(pixelBytes, i);
			--pixelsOfOwner[pxlId];
			pixels[i] = LibPixels.decode(pxlId);
		}

		MagicPlates(s.plts).mint(msg.sender, pixels, delays);

		emit Minted(msg.sender, pixelBytes);
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

}