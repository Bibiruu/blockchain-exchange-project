// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

contract TokenNBRCb {
    string public name = "Nobrac";
    string public symbol = "NBRCb";
    uint256 public decimals = 18;
    uint256 public totalSupply;

    constructor() {
        totalSupply = 1000000 * (10 ** decimals);
    }
}

