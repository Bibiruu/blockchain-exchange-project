// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

contract TokenNBRCb {
    string public name = "Nobrac";
    string public symbol = "NBRCb";
    uint256 public decimals = 18;
    uint256 public totalSupply;

    mapping(address => uint256) public balanceOf;

    constructor() {
        totalSupply = 1000000 * (10**decimals);
        balanceOf[msg.sender] = totalSupply; // key,value
    }

    function transfer(address _to, uint256 _value)
        public
        returns (bool success)
    {
        balanceOf[msg.sender] = balanceOf[msg.sender] - _value; //decrease balance
        balanceOf[_to] = balanceOf[_to] + _value; // increase to balance
        return true;
    }
}
