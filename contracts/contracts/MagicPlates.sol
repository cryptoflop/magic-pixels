// SPDX-License-Identifier: UNKOWN
pragma solidity ^0.8.9;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721BurnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721RoyaltyUpgradeable.sol";

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

import "./diamond/facets/MagicPixels/IMagicPixels.sol";

import "hardhat/console.sol";

contract MagicPlates is Initializable, ERC721Upgradeable, ERC721EnumerableUpgradeable, ERC721URIStorageUpgradeable, ERC721BurnableUpgradeable, ERC721RoyaltyUpgradeable, OwnableUpgradeable {
    using CountersUpgradeable for CountersUpgradeable.Counter;

    CountersUpgradeable.Counter private _tokenIdCounter;

    struct Delay { uint256 idx; uint16 delay;}

    mapping(uint256 => uint8[][]) private plates;
    mapping(uint256 => Delay[]) private pixelDelays;

    mapping(uint8 => string) private pixelColors;

    uint96 private fee; // royalty fee

    IMagicPixels public mgcpxl;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize() initializer public {
        __ERC721_init("MagicPixels", "MGPX");
        __ERC721Enumerable_init();
        __ERC721URIStorage_init();
        __ERC721Burnable_init();
        __Ownable_init();
				fee = 70; // 0.70%
    }

    /// Setters

    function setMagicPixels(address adr) external onlyOwner {
        mgcpxl = IMagicPixels(payable(adr));
        _setDefaultRoyalty(adr, fee);
    }

    function setColors(string[] calldata colors) external onlyOwner {
        for (uint8 i = 0; i < colors.length; i++) {
            pixelColors[i] = colors[i];
        }
    }

    function setFee(uint96 f) external onlyOwner {
        fee = f;
    }


    /// Public

    /// @notice Mints a MagicPlate nft that will be made up of the given pixels.
    function mint(address to, uint8[][] memory plate, uint256[] calldata delays) external {
        require(msg.sender == address(mgcpxl), "not allowed.");

        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        
        plates[tokenId] = plate;

				if (delays.length > 0) {
        	Delay[] storage d = pixelDelays[tokenId];
					for (uint i = 0; i < (delays.length - 1); i += 2) {
							d.push(Delay(delays[i], uint16(delays[i + 1])));
					}
				}
    }


    /// @dev Also frees the underlying pixels the plate was made of.
    function _burn(uint256 tokenId)
        internal
        override(ERC721Upgradeable, ERC721URIStorageUpgradeable, ERC721RoyaltyUpgradeable)
    {
        address to = ownerOf(tokenId);
        super._burn(tokenId);
        mgcpxl.restore(to, plates[tokenId]);
        delete plates[tokenId];
        delete pixelDelays[tokenId];
    }


    /// @dev Returns the pixels that the plate is made of.
    function underlyingPixels(uint256 tokenId)
        public
        view
        returns (uint8[][] memory, Delay[] memory)
    {
        return (plates[tokenId], pixelDelays[tokenId]);
    }

    /// @dev Super gas guzzler, but this is a call function. If you need the pixel data use "underlyingPixels".
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721Upgradeable, ERC721URIStorageUpgradeable)
        returns (string memory)
    {
        uint8[][] memory plate = plates[tokenId];
        Delay[] memory delays = pixelDelays[tokenId];
        uint256 dim = Math.sqrt(plate.length);

        string memory inner = "";

        for (uint i = 0; i < plate.length; i++) {
            uint8[] memory pixel = plate[i];

						if (pixel.length == 1) {

							inner = string.concat(inner, string(abi.encodePacked(
									"%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%22", // "<rect width=\"1\" height=\"1\" x=\""
									Strings.toString(i % dim), "%22%20y%3D%22", // "\" y=\""
									Strings.toString((((i + dim) / dim) - 1)), "%22%20fill%3D%22", // "\" fill=\""
									pixelColors[pixel[0]], "%22%2F%3E" // "\"/>"
							)));

						} else {

							bytes memory delayStr = bytes("0.00");
							if (delays.length > 0) {
								uint16 delay = 0;
								for (uint j = 0; j < delays.length; j++) {
										if (delays[j].idx == i) { delay = delays[j].delay; break; }
								}
								bytes memory delayBytes = bytes(Strings.toString(delay));
								for (uint j = 0; j < delayBytes.length; j++) {
										if (j == 2) { delayStr[0] = delayBytes[0]; break; }
										delayStr[(delayStr.length - 1) - j] = delayBytes[(delayBytes.length - 1) - j];
								}
							}

							string memory colors;
							for (uint j = 0; j <= pixel.length; j++) {
									colors = string.concat(colors, string.concat(pixelColors[pixel[j % pixel.length]], "%3B" /* ";" */));
									if (bytes(pixelColors[pixel[j % pixel.length]]).length == 0) {
										console.log(pixel[j % pixel.length]);
									}
							}

							inner = string.concat(inner, string(abi.encodePacked(
									"%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%22", // "<rect width=\"1\" height=\"1\" x=\""
									Strings.toString(i % dim), "%22%20y%3D%22", // "\" y=\""
									Strings.toString((((i + dim) / dim) - 1)), "%22%20fill%3D%22", // "\" fill=\""
									pixelColors[pixel[0]], "%22%3E", // "\">"
									"%3Canimate%20attributeName%3D%22fill%22%20dur%3D%22", // "<animate attributeName=\"fill\" dur=\""
									Strings.toString(pixel.length + 1),
									"s%22%20repeatCount%3D%22indefinite%22%20begin%3D%22", // "s\" repeatCount=\"indefinite\" begin=\""
									string(delayStr), "s%22%20", // "s\" "
									"values%3D%22", // "values=\"" 
									colors,
									"%22%20%2F%3E", // "\" />"
									"%3C%2Frect%3E" // "</rect>"
							)));
						}
        }

        return string(abi.encodePacked(
            "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20xmlns%3Axlink%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%22%20shape-rendering%3D%22optimizeSpeed%22%20viewBox%3D%220%200%20", // "<svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" shape-rendering=\"optimizeSpeed\" viewBox=\"0 0 "
            Strings.toString(dim), "%20", // " "
            Strings.toString(dim), "%22%3E", // "\">"
            inner, 
            "%3C%2Fsvg%3E" // </svg>
        ));
    }


		// The following functions are overrides required by Solidity.

    function _beforeTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize)
			internal
			override(ERC721Upgradeable, ERC721EnumerableUpgradeable)
    {
			super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    function supportsInterface(bytes4 interfaceId)
			public
			view
			override(ERC721Upgradeable, ERC721EnumerableUpgradeable, ERC721URIStorageUpgradeable, ERC721RoyaltyUpgradeable)
			returns (bool)
    {
			return super.supportsInterface(interfaceId);
    }
}