// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import { LibPixels } from "./LibPixels.sol";

contract PxlsCore {

  constructor() {}

	event Conjured(address indexed to, uint8[][] pixels);
	event EthFound(address indexed to, uint256 amount);

	/// @notice Generates random pixels
	function conjure(uint256 batches) external payable {
		LibPixels.Storage storage s = LibPixels.store();

		require(msg.value >= (s.PRICE * batches), "not enough eth.");

		uint256 rnd = uint256(keccak256(abi.encodePacked(block.prevrandao, block.timestamp, tx.origin)));

		uint8[][] memory conjured = new uint8[][](batches * s.BATCH_SIZE);
		uint8[][] storage pixels = s.pixelMap[msg.sender];

		// conjure actual pixels
		for (uint i = 0; i < batches * s.BATCH_SIZE; i++) {
			uint256 rndI = uint256(keccak256(abi.encode(rnd, i + 1)));

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
				pixel[j] = uint8(uint256(keccak256(abi.encode(rndI, j))) % s.MAX_PIXEL + 1);
			}
			conjured[i] = pixel;
			pixels.push(pixel);
		}

		emit Conjured(msg.sender, conjured);
		
		// check if eth was found
		if (address(this).balance < 0.01 ether) { return; }
		uint256 b = uint256(rnd % s.ETH_PROB);
		for (uint i = 0; i < batches; i++) {
			uint256 w = uint256(uint256(keccak256(abi.encode(rnd, i * 321))) % s.ETH_PROB);
			if (w == b) {
				uint256 eth = address(this).balance / s.ETH_PERC;
				(bool success, ) = msg.sender.call{value: eth}("");
				if (success) {
					emit EthFound(msg.sender, eth);
					return;
				}
			}
		}
	}

	struct Delay { uint256 idx; uint16 delay; }
	/// @notice Uses pixels to mint a MagicPixels nft
	function mint(uint256[] calldata indices, uint256[] calldata delays) external {
		LibPixels.Storage storage s = LibPixels.store();

		uint8[][] storage pixels = s.pixelMap[msg.sender];
		
		require(pixels.length >= indices.length, "not enough pixels.");

		uint8[][] memory plate = new uint8[][](indices.length);

		for (uint i = 0; i < indices.length; i++) {
			uint256 idx = indices[i];
			require(idx >= 0 && idx < pixels.length, "pixel out of range.");
			plate[i] = pixels[idx];
		}

		// pop used pixels
		quickSort(indices, 0, indices.length - 1); // we need the indices in a desc order
		for (uint i = 0; i < indices.length; i++) {
			uint256 idx = indices[i];
			uint256 len = pixels.length - 1;
			if (idx < len) {
				pixels[idx] = pixels[len];
			}
			pixels.pop();
		}

		s.nft.mint(msg.sender, plate, delays);
	}
	
	/// @dev restores pixels from a burned nft
	function restore(address to, uint8[][] calldata plate) external {
		LibPixels.Storage storage s = LibPixels.store();
		require(msg.sender == address(s.nft), "not allowed.");

		uint8[][] storage pixels = s.pixelMap[to];    

		for (uint i = 0; i < plate.length; i++) {
			pixels.push(plate[i]);
		}

		emit Conjured(to, plate);
	}
	

	function quickSort(uint[] memory arr, uint256 left, uint256 right) internal pure {
		uint256 i = left;
		uint256 j = right;
		if (i == j) return;
		uint256 pivot = arr[uint256(left + (right - left) / 2)];
		while (i <= j) {
			while (arr[uint256(i)] > pivot) i++;
			while (pivot > arr[uint256(j)]) j--;
			if (i <= j) {
				(arr[uint256(i)], arr[uint256(j)]) = (arr[uint256(j)], arr[uint256(i)]);
				i++;
				j--;
			}
		}
		if (left < j)
			quickSort(arr, left, j);
		if (i < right)
			quickSort(arr, i, right);
	}

}