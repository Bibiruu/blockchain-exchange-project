//chai testing environment
import { tokens } from "./helpers";

let TokenNBRCb = artifacts.require("./TokenNBRCb");

require("chai").use(require("chai-as-promised")).should();

contract("TokenNBRCb", ([deployer, receiver]) => {
  let token;
  const name = "Nobrac";
  const symbol = "NBRCb";
  const decimals = "18";
  const totalSupply = tokens(1000000).toString();

  //before , itireate once through token.new()
  beforeEach(async () => {
    token = await TokenNBRCb.new(); // deploying new copy to the blockchain
  });

  //'accounts' from all the personal blockchain
  //fect token from blckchain
  //read token name
  //check token name 'My name'
  describe("deployment", () => {
    it("tracks the name", async () => {
      const result = await token.name();
      result.should.equal(name);
    });
    it("tracks the symbol", async () => {
      const result = await token.symbol();
      result.should.equal(symbol);
    });
    it("tracks the decimals", async () => {
      const result = await token.decimals();
      result.toString().should.equal(decimals);
    });
    it("tracks the total supply", async () => {
      const result = await token.totalSupply();
      result.toString().should.equal(totalSupply.toString());
    });
    it("assings the total supply to the deployer", async () => {
      const result = await token.balanceOf(deployer);
      result.toString().should.equal(totalSupply.toString());
    });
  });

  describe("sending tokens", () => {
    it("transfer token balances", async () => {
      let balanceOf;
      /*before transfer
      balanceOf = await token.balanceOf(deployer);
      console.log("deployer balance before transfer", balanceOf.toString());
      balanceOf = await token.balanceOf(receiver);
      console.log("receiver balance before transfer", balanceOf.toString());*/
      //transfer
      //from:deployer - metadata, web3 concept
      await token.transfer(receiver, tokens(100), {
        from: deployer,
      });

      //after transfer
      balanceOf = await token.balanceOf(deployer);
      //million - 100 tokens = 999900
      balanceOf.toString().should.equal(tokens(999900).toString());
      console.log("deployer balance after transfer", balanceOf.toString());
      balanceOf = await token.balanceOf(receiver);
      balanceOf.toString().should.equal(tokens(100).toString());
      console.log("receiver balance after transfer", balanceOf.toString());

      //balance
    });
  });
});
