// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

//deposit and withdraw funds
//manage orders - make or cancel
//handle trades - charge fees

/**list
[x]set the fee
[ ]deposit ether
[ ]withdraw ether
[ ]deposit tokens
[ ]withdraw tokens
[ ]check balances
[ ]make order
[ ]cancel order
[ ]fill order
 */

import "./TokenNBRCb.sol";

contract Exchange {
    //variables
    // the account that receives exchange fees
    address public feeAccount; 
    uint256 public feePercent;
    //store Ether in tokens mapping with blank address
    address constant ETHER = address(0); 

    mapping(address => mapping(address => uint256)) public tokens; 
    mapping(uint => _Order) public orders; //allowing to read all the orders ffrom mapping

    event Deposit(address token, address user, uint256 amount, uint256 balance);
    event Withdraw(address token, address user, uint amount, uint balance);

    //storing the order
    struct _Order {
        uint id;
        //who created the order
        address user; 
        // the token they want to purchase : tokenChoice?
        address tokenGet;
        uint amountGet;
        //the token they want to use in the trade
        address tokenGive;
        uint amountGive;
        uint timestamp;
    }

    //a way to store the order
    //add the order to storage


    constructor(address _feeAccount, uint256 _feePercent) {
        feeAccount = _feeAccount;
        feePercent = _feePercent;
    }

    function fallBack() external payable {
        revert();
    }

    function depositEther() public payable {
        tokens[ETHER][msg.sender] = tokens[ETHER][msg.sender] + msg.value; //passing + update
        emit Deposit(ETHER, msg.sender, msg.value, tokens[ETHER][msg.sender]);
    }

    function withdrawEther(address payable owner, uint _amount) public {
        require(tokens[ETHER][msg.sender] >= _amount); //eth has to be more or equal to the amount
        tokens[ETHER][msg.sender] = tokens[ETHER][msg.sender] - _amount;
        owner.transfer(_amount);
        emit Withdraw(ETHER, msg.sender, _amount, tokens[ETHER][msg.sender]);
    }

    function depositToken(address _token, uint _amount) public {
        //dont allow ether deposit
        require(_token != ETHER);
        //which token?
        require(
            TokenNBRCb(_token).transferFrom(msg.sender, address(this), _amount) // transfering TO the sm
        );
        tokens[_token][msg.sender] = tokens[_token][msg.sender] + _amount; //passing + update
        emit Deposit(_token, msg.sender, _amount, tokens[_token][msg.sender]);
        //how much?
        //manage deposit
        //send tokens to this contract
    }

    function withdrawToken(address _token, uint _amount) public {
        require(_token != ETHER);
        require(tokens[_token][msg.sender] >= _amount); //amount check
        tokens[_token][msg.sender] = tokens[_token][msg.sender] - _amount;
        require(TokenNBRCb(_token).transfer(msg.sender, _amount)); // transfering FROM the sm back to the user
        emit Withdraw(_token, msg.sender, _amount, tokens[_token][msg.sender]); //balance = tokens[_token][msg.sender]
    }

    function balanceOf(
        address _token,
        address _user
    ) public view returns (uint256) {
        return tokens[_token][_user];
    }
}
