//testing environment
let TokenNBRCb = artifacts.require("./TokenNBRCb");

require("chai").use(require("chai-as-promised")).should();

contract("TokenNBRCb", (accounts) => {
  let token;
  const name = "Nobrac";
  const symbol = "NBRCb";
  const decimals = "18";
  const totalSupply = "1000000000000000000000000";

  //before , itireate once through token.new()
  beforeEach(async () => {
    token = await TokenNBRCb.new();
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
      result.toString().should.equal(totalSupply);
    });
  });
});
