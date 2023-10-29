// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

contract PxlsRng {

  constructor() {}

	/// @notice Returns a rnd number, for the start this is random/secure enough, later on oracles could be used
	function rnd(address sender) view external returns(uint256) {
		return uint256(keccak256(abi.encodePacked(block.prevrandao, block.timestamp, sender)));
	}

}