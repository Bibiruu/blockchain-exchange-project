//chai testing environment
import { tokens, EVM_REVERT } from "./helpers";

const Token = artifacts.require("./Token")
const Exchange = artifacts.require("./Exchange");

require("chai").use(require("chai-as-promised")).should();

contract("Exchange", ([deployer, feeAccount]) => {
  let token;
  let exchange;
  const feePercent = 1;

  //before , itireate once through token.new()
  beforeEach(async () => {
    token = await Token.new()
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

  describe("depositing tokens", () => {
    beforeEach(async () => {
      await token.approve(exchange.address, tokens(10), from {})
    });

    describe("success", async () => {
      it("tracks the token deposit", async () => {
        const result = await 
      });
    });
  });
});
