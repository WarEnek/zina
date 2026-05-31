// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title ProofRollArena
/// @notice Testnet-only verifiable game demo. No value custody, no deposits, no payouts.
contract ProofRollArena {
    struct PlayerStats {
        uint256 totalRolls;
        int256 score;
        uint256 bestStreak;
        uint256 currentStreak;
        uint256 lastRollId;
    }

    struct Roll {
        uint256 id;
        address player;
        uint8 result;
        int256 scoreDelta;
        uint256 blockNumber;
        uint256 timestamp;
    }

    uint256 public totalRolls;

    mapping(address => PlayerStats) public playerStats;
    mapping(uint256 => Roll) public rolls;

    event RollResolved(
        uint256 indexed rollId,
        address indexed player,
        uint8 result,
        int256 scoreDelta,
        int256 newScore,
        uint256 currentStreak,
        uint256 bestStreak
    );

    /// @dev Demo-only deterministic pseudo-randomness from public chain data.
    /// Not secure for production randomness.
    function roll() external returns (uint256 rollId) {
        rollId = ++totalRolls;
        uint8 result = uint8(uint256(keccak256(abi.encodePacked(msg.sender, block.prevrandao, block.timestamp, rollId))) % 6) + 1;

        PlayerStats storage stats = playerStats[msg.sender];
        stats.totalRolls += 1;

        int256 scoreDelta;
        if (result <= 2) {
            scoreDelta = -1;
            stats.currentStreak = 0;
        } else if (result <= 5) {
            scoreDelta = 1;
            stats.currentStreak += 1;
        } else {
            scoreDelta = 3;
            stats.currentStreak += 1;
        }

        stats.score += scoreDelta;
        if (stats.currentStreak > stats.bestStreak) {
            stats.bestStreak = stats.currentStreak;
        }
        stats.lastRollId = rollId;

        rolls[rollId] = Roll({
            id: rollId,
            player: msg.sender,
            result: result,
            scoreDelta: scoreDelta,
            blockNumber: block.number,
            timestamp: block.timestamp
        });

        emit RollResolved(rollId, msg.sender, result, scoreDelta, stats.score, stats.currentStreak, stats.bestStreak);
    }

    function getPlayerStats(address player) external view returns (PlayerStats memory) {
        return playerStats[player];
    }

    function getRoll(uint256 rollId_) external view returns (Roll memory) {
        return rolls[rollId_];
    }
}
