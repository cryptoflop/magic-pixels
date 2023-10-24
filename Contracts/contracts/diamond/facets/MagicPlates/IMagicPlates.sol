// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

interface IMagicPlates {
  function mint(address to, uint8[][] memory plate, uint256[] calldata delays) external;
}