// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script} from "forge-std/Script.sol";
import {ProofRollArena} from "../src/ProofRollArena.sol";

contract Deploy is Script {
    function run() external returns (ProofRollArena deployed) {
        uint256 privateKey = vm.envUint("PRIVATE_KEY");

        vm.startBroadcast(privateKey);
        deployed = new ProofRollArena();
        vm.stopBroadcast();
    }
}
