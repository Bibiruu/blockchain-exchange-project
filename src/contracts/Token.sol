// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Token {
    string public name = "Nobrac Beta";
    string public symbol = "NBRCb";
    uint256 public decimals = 18;
    uint256 public totalSupply;

    constructor() {
        totalSupply = 1000000 * (10 ** decimals);
    }
}

