// SPDX-License-Identifier: UNKNOWN
pragma solidity ^0.8.21;

import "./PxlsRng.sol";
import { LibDiamond } from "../../libraries/LibDiamond.sol";
import { LibPixels } from "../../libraries/LibPixels.sol";

contract PxlsCore {

	error Unauthorized();
	error InvalidIndicies();
	error InsufficientValue();
	error InsufficientPixels();

  constructor() {}

	event Conjured(address indexed to, bytes4[] pixels);
	event EthFound(address indexed to, uint256 amount);

	/// @notice Conjures random pixels from the nether | 8,666,031 gas for 144 pxl
	function conjure(uint256 numPixels) external payable {
		LibPixels.Storage storage s = LibPixels.store();

		if (msg.value < (s.PRICE * numPixels)) revert InsufficientValue();

		uint256 rnd = PxlsRng(LibDiamond.diamondStorage().diamondAddress).rnd(msg.sender);

		bytes4[] memory conjured = new bytes4[](numPixels);
		mapping(bytes4 => uint32) storage pixels = s.pixelMap[msg.sender];

		// conjure actual pixels
		for (uint i = 0; i < numPixels; i++) {
			uint256 rndI = uint256(keccak256(abi.encodePacked(rnd, i + 1)));

			uint8 depth;
			uint256 pd = rndI % 100_000;
			for (uint j = 0; j < s.DEPTH_PROBS.length; j++) {
				if (pd <= s.DEPTH_PROBS[j]) {
					depth = uint8(j + 1);
					break;
				}
			}

			uint8[] memory pixel = new uint8[](depth);
			for (uint j = 0; j < depth; j++) {
				pixel[j] = uint8(uint256(keccak256(abi.encodePacked(rndI, j))) % s.MAX_PIXEL + 1);
			}

			bytes4 pxlId = LibPixels.encode(pixel);
			conjured[i] = pxlId;
			++pixels[pxlId];
		}

		emit Conjured(msg.sender, conjured);
		
		// check if eth was found
		if (address(this).balance < 0.01 ether) { return; }
		if (block.number - s.ETH_LAST_BLOCK < 10) { return; }
		uint256 b = uint256(rnd % s.ETH_PROB);
		for (uint i = 0; i < (numPixels / 8); i++) {
			uint256 w = uint256(uint256(keccak256(abi.encodePacked(rnd, i * 321))) % s.ETH_PROB);
			if (w == b) {
				uint256 eth = address(this).balance / s.ETH_PERC;
				(bool success, ) = msg.sender.call{value: eth}("");
				if (success) {
					s.ETH_LAST_BLOCK = block.number;
					emit EthFound(msg.sender, eth);
					return;
				}
			}
		}
	}

	struct Delay { uint256 idx; uint16 delay; }
	/// @notice Uses pixels to mint a MagicPixels nft
	function mint(bytes4[] calldata indices, uint256[] calldata delays) external {
		LibPixels.Storage storage s = LibPixels.store();

		mapping(bytes4 => uint32) storage pixels = s.pixelMap[msg.sender];
		
		uint8[][] memory plate = new uint8[][](indices.length);

		for (uint i = 0; i < indices.length; i++) {
			bytes4 pxlId = indices[i];
			plate[i] = LibPixels.decode(pxlId);
			--pixels[pxlId];
		}

		s.nft.mint(msg.sender, plate, delays);
	}
	
	/// @dev restores pixels from a shattered plate
	function restore(address to, uint8[][] calldata plate) external {
		LibPixels.Storage storage s = LibPixels.store();
		if (msg.sender != address(s.nft)) revert Unauthorized();

		mapping(bytes4 => uint32) storage pixels = s.pixelMap[to];   

		bytes4[] memory restored = new bytes4[](plate.length);

		for (uint i = 0; i < plate.length; i++) {
			bytes4 pxlId = LibPixels.encode(plate[i]);
			++pixels[pxlId];
			restored[i] = pxlId;
		}

		emit Conjured(to, restored);
	}

}