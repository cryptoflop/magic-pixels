// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import { Ownable } from "../../Ownable.sol";
import { LibPixels } from "./LibPixels.sol";
import { IMagicPlates } from "../MagicPlates/IMagicPlates.sol";

contract PxlsSetters is Ownable {
    
  constructor() {}

  function setMagicPlates(address a) external onlyOwner {
    LibPixels.store().nft = IMagicPlates(a);
  }

  function setPlateSize(uint8 s) external onlyOwner {
    LibPixels.store().PLATE_SIZE = s;
  }

  function setBatchSize(uint8 s) external onlyOwner {
    LibPixels.store().BATCH_SIZE = s;
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