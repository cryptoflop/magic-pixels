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
import "@openzeppelin/contracts/utils/Base64.sol";

import "./diamond/facets/MagicPixels/PxlsInternal.sol";
import "./diamond/libraries/LibPixels.sol";

contract MagicPlates is
	Initializable,
	ERC721Upgradeable,
	ERC721EnumerableUpgradeable,
	ERC721URIStorageUpgradeable,
	ERC721BurnableUpgradeable,
	ERC721RoyaltyUpgradeable,
	OwnableUpgradeable
{
	using CountersUpgradeable for CountersUpgradeable.Counter;

	CountersUpgradeable.Counter private _tokenIdCounter;

	struct Delay {
		uint16 idx;
		uint16 delay;
	}

	struct Plate {
		uint256 id;
		bytes16 name;
		bytes pixels;
		bytes delays;
	}

	uint96 private fee; // royalty fee

	mapping(uint256 => Plate) private plates;

	mapping(uint8 => string) private pixelColors;

	address payable public pxls;

	/// @custom:oz-upgrades-unsafe-allow constructor
	constructor() {
		_disableInitializers();
	}

	function initialize() public initializer {
		__ERC721_init("MagicPixels", "MGPX");
		__ERC721Enumerable_init();
		__ERC721URIStorage_init();
		__ERC721Burnable_init();
		__Ownable_init();
		fee = 70; // 0.70%
	}

	function getFee() external view returns (uint96) {
		return fee;
	}

	/// Setters

	function setMagicPixels(address addr) external onlyOwner {
		pxls = payable(addr);
		_setDefaultRoyalty(addr, fee);
	}

	function setColors(string[] calldata colors) external onlyOwner {
		for (uint8 i = 0; i < colors.length; i++) {
			pixelColors[i] = colors[i];
		}
	}

	function setFee(uint96 f) external onlyOwner {
		fee = f;
	}

	/// Getters

	function platesOf(address owner) external view returns (Plate[] memory plts) {
		uint256 num = super.balanceOf(owner);

		plts = new Plate[](num);

		for (uint256 i = 0; i < num; i++) {
			uint256 id = super.tokenOfOwnerByIndex(owner, i);
			plts[i] = plateById(id);
		}
	}

	/// @dev Returns the pixels that the plate is made of.
	function plateById(uint256 tokenId) public view returns (Plate memory plate) {
		return plates[tokenId];
	}

	/// Public

	/// @notice Mints a MagicPlate nft that will be made up of the given pixels.
	function mint(
		address to,
		bytes16 name,
		bytes calldata pixels,
		bytes calldata delays
	) external {
		assert(msg.sender == pxls);

		uint256 tokenId = _tokenIdCounter.current();
		_tokenIdCounter.increment();
		_safeMint(to, tokenId);

		plates[tokenId] = Plate(tokenId, name, pixels, delays);
	}

	/// @dev Also frees the underlying pixels the plate was made of.
	function _burn(
		uint256 tokenId
	)
		internal
		override(
			ERC721Upgradeable,
			ERC721URIStorageUpgradeable,
			ERC721RoyaltyUpgradeable
		)
	{
		address to = ownerOf(tokenId);
		super._burn(tokenId);
		PxlsInternal(pxls).restore(to, plates[tokenId].pixels);
		delete plates[tokenId];
	}

	function isApprovedForAll(
		address owner,
		address operator
	) public view override(ERC721Upgradeable, IERC721Upgradeable) returns (bool) {
		return operator == pxls || super.isApprovedForAll(owner, operator);
	}

	/// @dev gas guzzler, but it's only read, you need the pixel data use "plateById".
	function tokenURI(
		uint256 tokenId
	)
		public
		view
		override(ERC721Upgradeable, ERC721URIStorageUpgradeable)
		returns (string memory)
	{
		Plate storage plate = plates[tokenId];
		bytes storage pixels = plate.pixels;
		uint256 lenP = pixels.length / 2;

		bytes storage delayBytes = plate.delays;
		uint256 lenD = delayBytes.length / 4;
		Delay[] memory delays = new Delay[](lenD);
		for (uint i = 0; i < lenD; i++) {
			delays[i] = Delay(
				uint16(LibPixels.unpackFromAt(delayBytes, (i * 2) + 0)),
				uint16(LibPixels.unpackFromAt(delayBytes, (i * 2) + 1))
			);
		}

		uint256 dim = Math.sqrt(lenP);

		string memory inner = "";

		for (uint i = 0; i < lenP; i++) {
			uint8 c1;
			uint8 c2;
			(c1, c2) = LibPixels.decode(LibPixels.unpackFromAt(pixels, i));

			if (c2 == 0) {
				// singlecolor
				inner = string.concat(
					inner,
					string.concat(
						'<rect width="1" height="1" x="',
						Strings.toString(i % dim),
						'" y="',
						Strings.toString((((i + dim) / dim) - 1)),
						'" fill="',
						pixelColors[c1],
						'"/>'
					)
				);
			} else {
				// multicolor
				string memory delayStr;
				if (delays.length > 0) {
					uint16 delay = 0;
					for (uint j = 0; j < delays.length; j++) {
						if (delays[j].idx == i) {
							delay = delays[j].delay;
							break;
						}
					}
					uint16 secs = delay % 60;
					delayStr = string.concat(
						Strings.toString(delay / 60),
						".",
						secs < 10 ? "0" : "",
						Strings.toString(secs)
					);
				} else {
					delayStr = "0";
				}

				string memory colors = string.concat(
					pixelColors[c1],
					";",
					pixelColors[c2],
					";",
					pixelColors[c1],
					";"
				);

				inner = string.concat(
					inner,
					string.concat(
						'<rect width="1" height="1" x="',
						Strings.toString(i % dim),
						'" y="',
						Strings.toString((((i + dim) / dim) - 1)),
						'" fill="',
						pixelColors[c1],
						'">',
						'<animate attributeName="fill" dur="3s" ',
						'repeatCount="indefinite" begin="',
						delayStr,
						's" ',
						'values="',
						colors,
						'" />',
						"</rect>"
					)
				);
			}
		}

		string memory svg = Base64.encode(
			bytes(
				string.concat(
					'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" shape-rendering="optimizeSpeed" viewBox="0 0 ',
					Strings.toString(dim),
					" ",
					Strings.toString(dim),
					'">',
					inner,
					"</svg>"
				)
			)
		);

		// sanitize name
		uint8 len = 0;
		for (uint8 i = 0; i < 16; i++) {
			if (plate.name[i] == 0) {
				len = i;
				break;
			}
		}
		bytes memory nameBytes = new bytes(len);
		for (uint8 i = 0; i < len; i++) {
			nameBytes[i] = plate.name[i];
		}

		string memory json = Base64.encode(
			bytes(
				string.concat(
					"{",
					'"name": "',
					string(nameBytes),
					'",',
					'"background_color": "000000",',
					'"description": "Plates forged in the nether.",',
					'"image_data": "data:image/svg+xml;base64,',
					svg,
					'",',
					'"attributes": [',
					"{",
					'"trait_type": "Dimensions",',
					'"value": "',
					string.concat(Strings.toString(dim), "x", Strings.toString(dim)),
					'"',
					"}",
					"]",
					"}"
				)
			)
		);

		return string.concat("data:application/json;base64,", json);
	}

	// The following functions are overrides required by Solidity.

	function _beforeTokenTransfer(
		address from,
		address to,
		uint256 tokenId,
		uint256 batchSize
	) internal override(ERC721Upgradeable, ERC721EnumerableUpgradeable) {
		super._beforeTokenTransfer(from, to, tokenId, batchSize);
	}

	function supportsInterface(
		bytes4 interfaceId
	)
		public
		view
		override(
			ERC721Upgradeable,
			ERC721EnumerableUpgradeable,
			ERC721URIStorageUpgradeable,
			ERC721RoyaltyUpgradeable
		)
		returns (bool)
	{
		return super.supportsInterface(interfaceId);
	}
}
