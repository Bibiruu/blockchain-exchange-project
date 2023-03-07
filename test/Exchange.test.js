//chai testing environment
import { tokens, EVM_REVERT } from "./helpers";

const Exchange = artifacts.require("./Exchange");

require("chai").use(require("chai-as-promised")).should();

contract("Exchange", ([deployer, feeAccount]) => {
  let exchange;
  const feePercent = 1;

  //before , itireate once through token.new()
  beforeEach(async () => {
    exchange = await Exchange.new(feeAccount, feePercent); // deploying new copy to the blockchain
  });

  describe("deployment", () => {
    it("tracks the fee account", async () => {
      const result = await exchange.feeAccount();
      result.should.equal(feeAccount);
    });
    it("tracks the fee percent", async () => {
      const result = await exchange.feePercent();
      result.toString().should.equal(feePercent.toString());
    });
  });
});
