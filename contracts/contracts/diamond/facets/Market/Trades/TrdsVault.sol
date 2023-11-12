// SPDX-License-Identifier: UNKNOWN
pragma solidity ^0.8.18;

/// @notice simple vault for the auctionhouse
contract TrdsVault {

	address private trds;

	constructor(address addr) {
		trds = addr;
	}

	receive() external payable {}

	function withdrawTo(address to, uint256 amount) external returns (bool) {
		require(msg.sender == trds, "Unauthorized.");
		(bool success, ) = to.call{value: amount}("");
		return success;
	}

}