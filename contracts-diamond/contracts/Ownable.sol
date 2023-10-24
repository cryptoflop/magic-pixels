// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { LibDiamond } from  "./libraries/LibDiamond.sol";

contract Ownable {

  error Unauthorized(address account);

  modifier onlyOwner() {
    if (LibDiamond.diamondStorage().contractOwner != msg.sender) {
      revert Unauthorized(msg.sender);
    }
    _;
  }

  function owner() internal view returns (address owner_) {
    owner_ = LibDiamond.diamondStorage().contractOwner;
  }

}
