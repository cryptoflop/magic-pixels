// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

interface IMagicPixels {
	function withdraw(uint256 amount) external returns (bool);

	function setMagicPlates(address a) external;

	function pixelsOf(address addr) external view returns (uint8[][] memory);

	function conjure(uint256 batches) external payable;
	function mint(uint256[] calldata indices, uint256[] calldata delays) external;
  function restore(address to, uint8[][] calldata plate) external;
}