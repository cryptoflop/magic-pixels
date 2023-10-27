// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { IMagicPlates } from "../MagicPlates/IMagicPlates.sol";

library LibPixels {
    bytes32 constant STORAGE_POSITION = keccak256("diamond.pixels.storage");

    struct Storage {
        uint8 PLATE_SIZE;
        uint8 MAX_PIXEL;
        uint8 PIXEL_DEPTH;

        uint256 ETH_PROB; // 0.01%
        uint256 ETH_PERC; // 10% percentage not the pill 🙄
				uint256 ETH_LAST_BLOCK; // last block eth was found

        uint256 PRICE;

        uint24[] DEPTH_PROBS;

        mapping(address => uint8[][]) pixelMap;

        IMagicPlates nft;
    }

    function store() internal pure returns (Storage storage s) {
        bytes32 position = STORAGE_POSITION;
        assembly {
            s.slot := position
        }
    }

}