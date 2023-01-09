// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract MagicPixel is Initializable, PausableUpgradeable, OwnableUpgradeable {
    address private _nether;

    mapping(address => mapping(uint8 => uint256)) private pixels;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize() initializer public {
        __Pausable_init();
        __Ownable_init();
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }



    function nether() public view virtual returns (address) {
        return _nether;
    }

    function _checkNether() internal view virtual {
        require(nether() == msg.sender, "Magic Pixels: caller is not the Nether");
    }

    modifier onlyNether() {
        _checkNether();
        _;
    }

    function setNether(address newNether) public virtual onlyOwner {
        require(newNether != address(0), "Magic Pixels: new nether is the zero address");
        _setNether(newNether);
    }

    function _setNether(address newNether) internal virtual {
        _nether = newNether;
    }



    function mintPixels(address sender, uint8[] calldata rnds) public onlyNether {
        for (uint8 i = 0; i < 10; i++) {
            uint8 pxIdx = rnds[i];
            uint256 amount = pixels[sender][pxIdx];
            pixels[sender][pxIdx] = amount + 1;
        }
    }
}