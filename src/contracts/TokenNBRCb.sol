// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

contract TokenNBRCb {
    //variables
    string public name = "Nobrac";
    string public symbol = "NBRCb";
    uint256 public decimals = 18;
    uint256 public totalSupply;

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance; //how many tokens is allowed to expend, second address is the exchange.

    //events
    //indexed, subscribing pertaining to us
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed _owner, address indexed _spender, uint256 _value);


    constructor() {
        totalSupply = 1000000 * (10**decimals);
        balanceOf[msg.sender] = totalSupply; // key,value
    }

    function transfer(address _to, uint256 _value)
        public
        returns (bool success)
    {
        require(_to != address(0)); //no invalid address
        require(balanceOf[msg.sender] >= _value); // have to have tokens or else error

        balanceOf[msg.sender] = balanceOf[msg.sender] - _value; //decrease balance
        balanceOf[_to] = balanceOf[_to] + _value; // increase to balance
        emit Transfer(msg.sender, _to, _value); // event trigger
        return true;
    }

    //approve tokens, allowing to spend
    function approve(address _spender, uint256 _value)
        public
        returns (bool success)
    {
        require(_spender != address(0));
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    //transfer from others
}
