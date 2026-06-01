// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script} from "forge-std/Script.sol";
import {CookieForge} from "../src/CookieForge.sol";

contract Deploy is Script {
    function run() external returns (CookieForge deployed) {
        uint256 privateKey = vm.envUint("PRIVATE_KEY");

        vm.startBroadcast(privateKey);
        deployed = new CookieForge();
        vm.stopBroadcast();
    }
}
