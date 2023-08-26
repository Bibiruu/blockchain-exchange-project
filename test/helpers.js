export const ETHER_ADDRESS = "0x0000000000000000000000000000000000000000";

export const EVM_REVERT = "VM Exception while processing transaction: revert";

const web3 = require('web3')
//web3 formatting, refactoring token supply number
export const ether = (numberOfTokens) => {
  return new web3.utils.BN(
    web3.utils.toWei(numberOfTokens.toString(), "ether")
  );
};

//same as ethers
//example 1000 tokens = 1 eth
export const tokens = (n) => ether(n)


