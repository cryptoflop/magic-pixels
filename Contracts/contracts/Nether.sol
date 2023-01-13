// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

interface INether {
    function conjurePixels(uint8 amount) external view returns (uint8[] memory);
}

contract Nether is
    INether,
    Initializable,
    PausableUpgradeable,
    OwnableUpgradeable
{
    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

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

    function conjurePixels(
        uint8 amount
    ) external view returns (uint8[] memory) {
        uint8[] memory rnds = new uint8[](amount);

        uint8 rndNonce = 0;
        for (uint8 i = 0; i < amount; i++) {
            rnds[i] = uint8(
                uint(
                    keccak256(
                        abi.encodePacked(block.timestamp, msg.sender, rndNonce)
                    )
                ) % 100
            );
            rndNonce++;
        }

        return rnds;
    }
}
