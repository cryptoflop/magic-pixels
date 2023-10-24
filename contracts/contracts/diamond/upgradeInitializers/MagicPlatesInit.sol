// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { DiamondInit } from "./DiamondInit.sol";

import {LibDiamond} from "../libraries/LibDiamond.sol";


contract MagicPlatesInit is DiamondInit {    

    function init() public override {
        super.init();
        
				LibDiamond.DiamondStorage storage ds = LibDiamond.diamondStorage();
				ds.supportedInterfaces[0x80ac58cd] = true; // ERC721 - nft
        ds.supportedInterfaces[0x780e9d63] = true; // ERC721 - enumerable
				ds.supportedInterfaces[0x49064906] = true; // ERC4906 - URIStorage
				ds.supportedInterfaces[0x2a55205a] = true; // ERC2981 - royalty


        // TODO: init storages
    }

}