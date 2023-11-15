// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {DiamondInit} from "./DiamondInit.sol";
import {LibPixels} from "../libraries/LibPixels.sol";

contract MagicPixelsInit is DiamondInit {
	function init() public override {
		super.init();

		LibPixels.Storage storage s = LibPixels.store();

		s.MIN_PIXEL = 1;
		s.MAX_PIXEL = 189;
		s.PIXEL_DEPTH = 2;

		s.UF_PROB = 10000;
		s.UF_PERC = 10;

		s.PRICE = 0.08 ether;

		s.DEPTH_PROBS = [80_000, 100_000];
	}
}
