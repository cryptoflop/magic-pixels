// SPDX-License-Identifier: UNKNOWN
pragma solidity ^0.8.18;

import {Ownable} from "../../../Ownable.sol";
import {LibTrades} from "../../../libraries/LibTrades.sol";

contract TrdsSetters is Ownable {
	constructor() {}

	function setVault(address payable vault) external onlyOwner {
		LibTrades.store().vault = vault;
	}
}
