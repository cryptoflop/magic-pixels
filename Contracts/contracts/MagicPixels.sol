// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract MagicPixels is Initializable, PausableUpgradeable, OwnableUpgradeable {
    uint private constant PIXEL_CONJURING_AMOUNT = 8;

    address private _nether;

    mapping(address => mapping(uint8 => uint256)) private pixels;

    event PixelsConjured(
        address indexed conjuror,
        uint8[PIXEL_CONJURING_AMOUNT] pixels
    );

    function initialize() public initializer {
        __Pausable_init();
        __Ownable_init();
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function getAllPixels(
        address owner
    ) public view returns (uint256[220] memory) {
        mapping(uint8 => uint256) storage m = pixels[owner];
        uint256[220] memory values;
        for (uint8 i = 0; i < 220; i++) {
            values[i] = m[i];
        }
        return values;
    }

    function nether() public view returns (address) {
        return _nether;
    }

    function _checkNether() internal view virtual {
        require(
            nether() == msg.sender,
            "Magic Pixels: caller is not the Nether"
        );
    }

    modifier onlyNether() {
        _checkNether();
        _;
    }

    function setNether(address newNether) public virtual onlyOwner {
        require(
            newNether != address(0),
            "Magic Pixels: new nether is the zero address"
        );
        _setNether(newNether);
    }

    function _setNether(address newNether) internal virtual {
        _nether = newNether;
    }

    function mintPixels(
        address conjuror,
        uint8[PIXEL_CONJURING_AMOUNT] calldata rnds
    ) public onlyNether {
        for (uint8 i = 0; i < PIXEL_CONJURING_AMOUNT; i++) {
            uint8 pxIdx = rnds[i];
            uint256 amount = pixels[conjuror][pxIdx];
            pixels[conjuror][pxIdx] = amount + 1;
        }
        emit PixelsConjured(conjuror, rnds);
    }
}
