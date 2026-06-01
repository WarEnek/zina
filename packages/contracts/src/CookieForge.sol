// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC1155} from "../lib/openzeppelin-contracts/contracts/token/ERC1155/ERC1155.sol";
import {ERC1155Supply} from "../lib/openzeppelin-contracts/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import {Ownable} from "../lib/openzeppelin-contracts/contracts/access/Ownable.sol";

/// @title CookieForge
/// @notice Testnet-only Bake-to-Reveal collectible demo with transparent odds.
contract CookieForge is ERC1155Supply, Ownable {
    enum Rarity {
        Common,
        Rare,
        Epic,
        Legendary,
        Mythic
    }

    struct CookieDefinition {
        uint256 tokenId;
        uint8 rarity;
        uint32 weight;
        string name;
    }

    struct BakeRecord {
        uint256 requestId;
        address user;
        uint256 tokenId;
        uint8 rarity;
        uint256 randomValue;
        uint256 blockNumber;
        uint256 timestamp;
    }

    struct PlayerStats {
        uint256 totalBakes;
        uint256 commonCount;
        uint256 rareCount;
        uint256 epicCount;
        uint256 legendaryCount;
        uint256 mythicCount;
        uint256 lastRequestId;
    }

    uint256 public constant VANILLA = 1;
    uint256 public constant OAT = 2;
    uint256 public constant CHOCOLATE = 3;
    uint256 public constant STRAWBERRY = 4;
    uint256 public constant LAVA = 5;
    uint256 public constant MACARON = 6;
    uint256 public constant GOLDEN = 7;
    uint256 public constant COSMIC = 8;

    uint256 public totalBakes;
    uint256 public totalWeight;
    uint256 public oddsUpdatedAt;
    bytes32 public oddsHash;

    uint32[9] private _weightsByTokenId;
    uint256[] private _tokenIds;

    mapping(uint256 => CookieDefinition) public cookieDefinitions;
    mapping(uint256 => BakeRecord) public bakes;
    mapping(address => PlayerStats) public playerStats;

    event CookieBakeRequested(address indexed user, uint256 indexed requestId);
    event CookieMinted(
        address indexed user,
        uint256 indexed tokenId,
        uint8 rarity,
        uint256 randomValue,
        uint256 requestId
    );
    event OddsUpdated(bytes32 oldHash, bytes32 newHash, uint256 updatedAt);

    constructor() ERC1155("https://cookieforge.example/metadata/{id}.json") Ownable(msg.sender) {
        _tokenIds.push(VANILLA);
        _tokenIds.push(OAT);
        _tokenIds.push(CHOCOLATE);
        _tokenIds.push(STRAWBERRY);
        _tokenIds.push(LAVA);
        _tokenIds.push(MACARON);
        _tokenIds.push(GOLDEN);
        _tokenIds.push(COSMIC);

        cookieDefinitions[VANILLA] = CookieDefinition(VANILLA, uint8(Rarity.Common), 3000, "Vanilla Cookie");
        cookieDefinitions[OAT] = CookieDefinition(OAT, uint8(Rarity.Common), 2000, "Oat Cookie");
        cookieDefinitions[CHOCOLATE] = CookieDefinition(CHOCOLATE, uint8(Rarity.Rare), 1800, "Chocolate Cookie");
        cookieDefinitions[STRAWBERRY] = CookieDefinition(STRAWBERRY, uint8(Rarity.Rare), 1200, "Strawberry Cookie");
        cookieDefinitions[LAVA] = CookieDefinition(LAVA, uint8(Rarity.Epic), 700, "Lava Cookie");
        cookieDefinitions[MACARON] = CookieDefinition(MACARON, uint8(Rarity.Epic), 700, "Macaron Cookie");
        cookieDefinitions[GOLDEN] = CookieDefinition(GOLDEN, uint8(Rarity.Legendary), 250, "Golden Cookie");
        cookieDefinitions[COSMIC] = CookieDefinition(COSMIC, uint8(Rarity.Mythic), 50, "Cosmic Cookie");

        _recomputeOdds();
    }

    function bakeCookie() external returns (uint256 requestId) {
        requestId = ++totalBakes;
        emit CookieBakeRequested(msg.sender, requestId);

        uint256 randomValue = uint256(keccak256(abi.encodePacked(msg.sender, block.prevrandao, block.timestamp, requestId)));
        uint256 tokenId = _resolveTokenId(randomValue);
        uint8 rarity = cookieDefinitions[tokenId].rarity;

        _mint(msg.sender, tokenId, 1, "");

        PlayerStats storage stats = playerStats[msg.sender];
        stats.totalBakes += 1;
        stats.lastRequestId = requestId;
        if (rarity == uint8(Rarity.Common)) stats.commonCount += 1;
        else if (rarity == uint8(Rarity.Rare)) stats.rareCount += 1;
        else if (rarity == uint8(Rarity.Epic)) stats.epicCount += 1;
        else if (rarity == uint8(Rarity.Legendary)) stats.legendaryCount += 1;
        else stats.mythicCount += 1;

        bakes[requestId] = BakeRecord({
            requestId: requestId,
            user: msg.sender,
            tokenId: tokenId,
            rarity: rarity,
            randomValue: randomValue,
            blockNumber: block.number,
            timestamp: block.timestamp
        });

        emit CookieMinted(msg.sender, tokenId, rarity, randomValue, requestId);
    }

    function setWeights(uint32[8] calldata weights) external onlyOwner {
        _weightsByTokenId[VANILLA] = weights[0];
        _weightsByTokenId[OAT] = weights[1];
        _weightsByTokenId[CHOCOLATE] = weights[2];
        _weightsByTokenId[STRAWBERRY] = weights[3];
        _weightsByTokenId[LAVA] = weights[4];
        _weightsByTokenId[MACARON] = weights[5];
        _weightsByTokenId[GOLDEN] = weights[6];
        _weightsByTokenId[COSMIC] = weights[7];

        for (uint256 i = 0; i < _tokenIds.length; i++) {
            uint256 tokenId = _tokenIds[i];
            cookieDefinitions[tokenId].weight = _weightsByTokenId[tokenId];
        }

        bytes32 oldHash = oddsHash;
        _recomputeOdds();
        emit OddsUpdated(oldHash, oddsHash, oddsUpdatedAt);
    }

    function getWeights() external view returns (uint32[8] memory weights) {
        weights[0] = _weightsByTokenId[VANILLA];
        weights[1] = _weightsByTokenId[OAT];
        weights[2] = _weightsByTokenId[CHOCOLATE];
        weights[3] = _weightsByTokenId[STRAWBERRY];
        weights[4] = _weightsByTokenId[LAVA];
        weights[5] = _weightsByTokenId[MACARON];
        weights[6] = _weightsByTokenId[GOLDEN];
        weights[7] = _weightsByTokenId[COSMIC];
    }

    function getRarityMintCounts(address user)
        external
        view
        returns (uint256 common, uint256 rare, uint256 epic, uint256 legendary, uint256 mythic)
    {
        PlayerStats memory stats = playerStats[user];
        return (stats.commonCount, stats.rareCount, stats.epicCount, stats.legendaryCount, stats.mythicCount);
    }

    function _resolveTokenId(uint256 randomValue) internal view returns (uint256) {
        uint256 threshold = randomValue % totalWeight;
        uint256 running;

        for (uint256 i = 0; i < _tokenIds.length; i++) {
            uint256 tokenId = _tokenIds[i];
            running += _weightsByTokenId[tokenId];
            if (threshold < running) {
                return tokenId;
            }
        }

        return COSMIC;
    }

    function _recomputeOdds() internal {
        if (_weightsByTokenId[VANILLA] == 0 && _weightsByTokenId[OAT] == 0) {
            _weightsByTokenId[VANILLA] = 3000;
            _weightsByTokenId[OAT] = 2000;
            _weightsByTokenId[CHOCOLATE] = 1800;
            _weightsByTokenId[STRAWBERRY] = 1200;
            _weightsByTokenId[LAVA] = 700;
            _weightsByTokenId[MACARON] = 700;
            _weightsByTokenId[GOLDEN] = 250;
            _weightsByTokenId[COSMIC] = 50;
        }

        uint256 sum;
        for (uint256 i = 0; i < _tokenIds.length; i++) {
            uint256 tokenId = _tokenIds[i];
            uint32 w = _weightsByTokenId[tokenId];
            cookieDefinitions[tokenId].weight = w;
            sum += w;
        }

        require(sum > 0, "Weights must be > 0");
        totalWeight = sum;
        oddsUpdatedAt = block.timestamp;
        oddsHash = keccak256(
            abi.encode(
                _weightsByTokenId[VANILLA],
                _weightsByTokenId[OAT],
                _weightsByTokenId[CHOCOLATE],
                _weightsByTokenId[STRAWBERRY],
                _weightsByTokenId[LAVA],
                _weightsByTokenId[MACARON],
                _weightsByTokenId[GOLDEN],
                _weightsByTokenId[COSMIC]
            )
        );
    }
}
