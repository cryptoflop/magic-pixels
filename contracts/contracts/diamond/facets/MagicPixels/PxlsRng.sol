// SPDX-License-Identifier: UNKNOWN
pragma solidity ^0.8.18;

contract PxlsRng {
	constructor() {}

	/// @notice Returns a rnd number, this is random/secure enough, oracles could be used though
	function rnd(address sender) external view returns (uint256) {
		return
			uint256(
				keccak256(abi.encodePacked(block.prevrandao, block.timestamp, sender))
			);
	}
}
