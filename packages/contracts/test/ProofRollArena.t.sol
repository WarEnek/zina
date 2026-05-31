// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {ProofRollArena} from "../src/ProofRollArena.sol";

contract ProofRollArenaTest is Test {
    event RollResolved(
        uint256 indexed rollId,
        address indexed player,
        uint8 result,
        int256 scoreDelta,
        int256 newScore,
        uint256 currentStreak,
        uint256 bestStreak
    );

    ProofRollArena internal arena;
    address internal alice = address(0xA11CE);
    address internal bob = address(0xB0B);

    function setUp() external {
        arena = new ProofRollArena();
    }

    function testInitialState() external view {
        assertEq(arena.totalRolls(), 0);
    }

    function testRollIncrementsAndStoresRecord() external {
        vm.prank(alice);
        uint256 id = arena.roll();

        assertEq(id, 1);
        assertEq(arena.totalRolls(), 1);

        (uint256 storedId, address player,, int256 scoreDelta,,) = arena.rolls(1);
        assertEq(storedId, 1);
        assertEq(player, alice);
        assertTrue(scoreDelta >= -1 && scoreDelta <= 3);
    }

    function testRollUpdatesPlayerStats() external {
        vm.prank(alice);
        arena.roll();

        (uint256 totalRolls,,,, uint256 lastRollId) = arena.playerStats(alice);
        assertEq(totalRolls, 1);
        assertEq(lastRollId, 1);
    }

    function testRollEmitsRollResolvedEvent() external {
        vm.expectEmit(true, true, false, false);
        emit RollResolved(1, alice, 0, 0, 0, 0, 0);

        vm.prank(alice);
        arena.roll();
    }

    function testMultipleUsersStatsAreIsolated() external {
        vm.prank(alice);
        arena.roll();

        vm.prank(bob);
        arena.roll();

        (uint256 aliceRolls,,,,) = arena.playerStats(alice);
        (uint256 bobRolls,,,,) = arena.playerStats(bob);

        assertEq(aliceRolls, 1);
        assertEq(bobRolls, 1);
    }

    function testNoValueCustodyFlow() external view {
        assertEq(address(arena).balance, 0);
    }
}
