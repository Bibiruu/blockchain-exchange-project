//web3 formatting, refactoring token supply number
export const tokens = (numberOfTokens) => {
  return new web3.utils.BN(
    web3.utils.toWei(numberOfTokens.toString(), "ether")
  );
};

export const EVM_REVERT = "VM exception while processing transction: revert"
