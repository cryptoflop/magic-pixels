// SPDX-License-Identifier: UNKNOWN
pragma solidity ^0.8.18;

import { SafeTransferLib  } from "solady/src/utils/SafeTransferLib.sol";

/// @notice simple vault for the auctionhouse
contract TrdsVault {

	address private trds;

	constructor(address addr) {
		trds = addr;
	}

	receive() external payable {}

	function withdrawTo(address to, uint256 amount) external {
		require(msg.sender == trds, "Unauthorized.");
		SafeTransferLib.safeTransferETH(to, amount);
	}

}