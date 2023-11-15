// SPDX-License-Identifier: UNKNOWN
pragma solidity ^0.8.18;

import { Ownable } from "../../Ownable.sol";
import { LibPixels } from "../../libraries/LibPixels.sol";

contract PxlsSetters is Ownable {
    
  constructor() {}

  function setMagicPlates(address plts) external onlyOwner {
    LibPixels.store().plts = plts;
  }

  function setMaxPixel(uint8 m) external onlyOwner {
    LibPixels.store().MAX_PIXEL = m;
  }

  function setPrice(uint256 p) external onlyOwner {
    LibPixels.store().PRICE = p;
  }

  function setDepthProbabilities(uint24[] calldata dp) external onlyOwner {
    LibPixels.store().DEPTH_PROBS = dp;
    LibPixels.store().PIXEL_DEPTH = uint8(dp.length);
  }

}