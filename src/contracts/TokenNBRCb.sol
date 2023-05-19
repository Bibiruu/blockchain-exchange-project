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
    event Approval(
        address indexed _owner,
        address indexed _spender,
        uint256 _value
    );

    constructor() {
        totalSupply = 1000000 * (10**decimals);
        balanceOf[msg.sender] = totalSupply; // key,value
    }

    function transfer(address _to, uint256 _value)
        public
        returns (bool success)
    {
        require(balanceOf[msg.sender] >= _value); // have to have tokens or else error
        _transfer(msg.sender, _to, _value);
        return true;
    }

    // this is an internal function only
    function _transfer(
        address _from,
        address _to,
        uint256 _value
    ) internal {
        require(_to != address(0)); //no invalid address
        balanceOf[_from] = balanceOf[_from] - _value; //decrease balance
        balanceOf[_to] = balanceOf[_to] + _value; // increase to balance
        emit Transfer(_from, _to, _value); // event trigger
    }

    //approve tokens, allowing to spend
    function approve(address _spender, uint256 _value)
        public
        returns (bool success)
    {
        require(_spender != address(0)); // address validation
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    //transfer from others
    function transferFrom(
        address _from,
        address _to,
        uint256 _value
    ) public returns (bool success) {
        require(_value <= balanceOf[_from]); // balance less from the account
        require(_value <= allowance[_from][msg.sender]); //value must be less than the approved amount for the exchange,

        allowance[_from][msg.sender] = allowance[_from][msg.sender] - _value;
        _transfer(_from, _to, _value);
        return true;
    }
}
