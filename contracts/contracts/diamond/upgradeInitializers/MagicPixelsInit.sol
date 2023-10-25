// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { DiamondInit } from "./DiamondInit.sol";
import { AuctionHouseInit } from "./AuctionHouseInit.sol";

import { LibPixels } from "../facets/MagicPixels/LibPixels.sol";

contract MagicPixelsInit is DiamondInit, AuctionHouseInit {    

    function init() public override(DiamondInit, AuctionHouseInit) {
        super.init();
        
        LibPixels.Storage storage s = LibPixels.store();

        s.PLATE_SIZE = 16;
        s.BATCH_SIZE = 20;
        s.MAX_PIXEL = 190;
        s.PIXEL_DEPTH = 2;
        
        s.ETH_PROB = 10000;
        s.ETH_PERC = 10;

        s.PRICE = 0.001 ether;

        uint24[2] memory t = [80_000, 100_000];
        s.DEPTH_PROBS = t;
    }

}