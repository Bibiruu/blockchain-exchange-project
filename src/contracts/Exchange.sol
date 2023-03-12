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
    address public feeAccount; // the account that receives exchange fees
    uint256 public feePercent;

    constructor(address _feeAccount, uint256 _feePercent) {
        feeAccount = _feeAccount;
        feePercent = _feePercent;
    }

    function depositToken(address _token, uint _amount) public { //which token and how much
        TokenNBRCb(_token).transferFrom(msg.sender, address(this), _amount);
            //send tokens to this contract
        //manage deposit - update balance
        //emit event
    }
}
