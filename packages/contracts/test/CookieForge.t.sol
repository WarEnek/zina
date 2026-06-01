// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {CookieForge} from "../src/CookieForge.sol";

contract CookieForgeTest is Test {
    event CookieBakeRequested(address indexed user, uint256 indexed requestId);
    event CookieMinted(
        address indexed user,
        uint256 indexed tokenId,
        uint8 rarity,
        uint256 randomValue,
        uint256 requestId
    );

    CookieForge internal forgeContract;
    address internal alice = address(0xA11CE);
    address internal bob = address(0xB0B);

    function setUp() external {
        forgeContract = new CookieForge();
    }

    function testInitialState() external view {
        assertEq(forgeContract.totalBakes(), 0);
        assertGt(forgeContract.totalWeight(), 0);
        assertTrue(forgeContract.oddsHash() != bytes32(0));
    }

    function testBakeCookieIncrementsAndStoresRecord() external {
        vm.prank(alice);
        uint256 requestId = forgeContract.bakeCookie();

        assertEq(requestId, 1);
        assertEq(forgeContract.totalBakes(), 1);

        (uint256 storedRequestId, address user, uint256 tokenId, uint8 rarity,,,) = forgeContract.bakes(1);
        assertEq(storedRequestId, 1);
        assertEq(user, alice);
        assertTrue(tokenId >= 1 && tokenId <= 8);
        assertTrue(rarity <= 4);
        assertEq(forgeContract.balanceOf(alice, tokenId), 1);
    }

    function testBakeUpdatesPlayerStats() external {
        vm.prank(alice);
        forgeContract.bakeCookie();

        (uint256 totalBakes,,,,,, uint256 lastRequestId) = forgeContract.playerStats(alice);
        assertEq(totalBakes, 1);
        assertEq(lastRequestId, 1);
    }

    function testBakeEmitsEvents() external {
        vm.expectEmit(true, true, false, false);
        emit CookieBakeRequested(alice, 1);
        vm.expectEmit(true, false, false, false);
        emit CookieMinted(alice, 0, 0, 0, 1);

        vm.prank(alice);
        forgeContract.bakeCookie();
    }

    function testMultipleUsersStatsAreIsolated() external {
        vm.prank(alice);
        forgeContract.bakeCookie();

        vm.prank(bob);
        forgeContract.bakeCookie();

        (uint256 aliceBakes,,,,,,) = forgeContract.playerStats(alice);
        (uint256 bobBakes,,,,,,) = forgeContract.playerStats(bob);

        assertEq(aliceBakes, 1);
        assertEq(bobBakes, 1);
    }

    function testOwnerCanUpdateWeightsAndHashChanges() external {
        bytes32 oldHash = forgeContract.oddsHash();
        uint32[8] memory weights = [uint32(4000), 2000, 1800, 1200, 700, 700, 250, 50];

        forgeContract.setWeights(weights);

        bytes32 newHash = forgeContract.oddsHash();
        assertTrue(newHash != oldHash);
    }
}
