// eslint-disable-next-line no-undef
//chai testing environment
import { tokens, EVM_REVERT } from "./helpers";

const { artifacts } = require("truffle");
const TokenNBRCb = artifacts.require("./TokenNBRCb");

require("chai").use(require("chai-as-promised")).should();

// eslint-disable-next-line no-undef
contract ("TokenNBRCb", ([deployer, receiver, exchange]) => {
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
  //fetch token from blockchain
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
    it("assigns the total supply to the deployer", async () => {
      const result = await token.balanceOf(deployer);
      result.toString().should.equal(totalSupply.toString());
    });
  });

  describe("sending tokens", () => {
    let result;
    let amount;

    describe("success", async () => {
      beforeEach(async () => {
        amount = tokens(100);
        result = await token.transfer(receiver, amount, { from: deployer });
      }); 

      it("transfers token balances", async () => {
        let balanceOf;
        /*before transfer
        balanceOf = await token.balanceOf(deployer);
        console.log("deployer balance before transfer", balanceOf.toString());
        balanceOf = await token.balanceOf(receiver);
        console.log("receiver balance before transfer", balanceOf.toString());*/
        //transfer
        //from:deployer - metadata, web3 concept
        //after transfer
        balanceOf = await token.balanceOf(deployer);
        //million - 100 tokens = 999900
        balanceOf.toString().should.equal(tokens(999900).toString());
        //console.log("deployer balance after transfer", balanceOf.toString());
        balanceOf = await token.balanceOf(receiver);
        balanceOf.toString().should.equal(tokens(100).toString());
        //console.log("receiver balance after transfer", balanceOf.toString());
      });

      it("emits a transfer event", async () => {
        const log = result.logs[0]; //after result has a feat of logs.
        log.event.should.eq("Transfer");
        const event = log.args;
        event.from.toString().should.equal(deployer, "from is correct");
        event.to.should.equal(receiver, "to is correct");
        event.value
          .toString()
          .should.equal(amount.toString(), "value is correct");
      });
    });

    describe("failure", () => {
      it("it rejects insufficient balances", async () => {
        let invalidAmount;
        invalidAmount = tokens(100000000); //100 +million - greater than total supply
        await token
          .transfer(receiver, invalidAmount, { from: deployer })
          .should.be.rejectedWith(EVM_REVERT);

        // Attempt transfer tokens, when you have none
        invalidAmount = tokens(10); // recipient has no tokens, testing for "fake 10"
        await token
          .transfer(deployer, invalidAmount, { from: receiver })
          .should.be.rejectedWith(EVM_REVERT);
      });
      it("rejects invalid recipients", async () => {
        await token.transfer(0x0, amount, { from: deployer }).should.be //0x0 = invalid address
          .rejected;
      });
    });
  });

  describe('("approving tokens")', () => {
    let result;
    let amount;

    beforeEach(async () => {
      //getting value + checking
      amount = tokens(100);
      result = await TokenNBRCb.approve(exchange, amount, { from: deployer }); //deployer approve the exchange w/ amount (100tokens)
    });

    describe("success", () => {
      beforeEach(async () => {
        it("allocates an allowance for delegated token spending on exchange", async () => {
          const allowance = await TokenNBRCb.allowance(deployer, exchange); //after approval added to tthe exchange
          allowance.toString().should.equal(amount.toString()); // checking if tokens added to the allownce
        });

        it("emits on Approval event", async () => {
          const log = result.logs[0];
          log.event.should.sq("Approval");
          const event = log.args;
          event.owner.toString().should.equal("owner is correct");
          event.spender.should.equal(exchange, "spender is correct");
          event.value.toString().should.equal(amount.toString(), "value is");
        });
      });
    });

    describe("failure", () => {
      beforeEach(() => {
        it("rejects approval of event", async () => {
          await TokenNBRCb.approve(0x0, amount, { from: deployer }).should.be
            .rejected;
        });
      });
    });
  });

  describe("delegated token transfers", () => {
    let result;
    let amount;

    beforeEach(async () => {
      amount = tokens(100);
      await token.approve(exchange, amount, { from: deployer }); //deployer has all the tokens
    });

    describe("success", async () => {
      beforeEach(async () => {
        result = await token.transferFrom(deployer, receiver, amount, {
          from: exchange,
        });
      });
      beforeEach(() => {
        it("transfers token balances", async () => {
          let balanceOf;
          balanceOf = await token.balanceOf(deployer);
          balanceOf.toString().should.equal(tokens(999900).toString());
          console.log("deployer balance after transfer", balanceOf.toString());
          balanceOf = await token.balanceOf(receiver);
          balanceOf.toString().should.equal(tokens(100).toString());
          console.log("receiver balance after transfer", balanceOf.toString());
        });

        it("reserts the allowance", async () => {
          const allowance = await TokenNBRCb.allowance(deployer, exchange); //after approval added to tthe exchange
          allowance.toString().should.equal("0"); // checking if tokens added to the allownce
        });
      });

      it("emits a transfer event", async () => {
        const log = result.logs[0];
        log.event.should.eq("Transfer");
        const event = log.args;
        event.from.toString().should.equal(deployer, "from is correct");
        event.to.should.equal(receiver, "to is correct");
        event.value
          .toString()
          .should.equal(amount.toString(), "value is correct");
      });
    });

    describe("failure", () => {
      it("rejects insufficient balances", async () => {
        //attempt transfer too many tokens
        const invalidAmount = tokens(100000000); //100 +million - greater than total supply
        await token
          .transferFrom(deployer, receiver, invalidAmount, { from: exchange })
          .should.be.rejectedWith(EVM_REVERT);
      });
      it("rejects invalid recipients", async () => {
        await token.transferFrom(deployer, 0x0, amount, { from: exchange })
          .should.be.rejected; //0x0 = invalid address
      });
    });
  });
});
