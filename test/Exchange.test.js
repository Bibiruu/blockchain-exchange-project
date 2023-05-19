// eslint-disable-next-line no-undef
//chai testing environment
import { should, use } from "chai";
import Web3 from "web3";
import { tokens, ether, EVM_REVERT, ETHER_ADDRESS } from "./helpers";

const Token = artifacts.require("./TokenNBRCb");
const Exchange = artifacts.require("./Exchange");

require("chai").use(require("chai-as-promised")).should();

contract("Exchange", ([deployer, feeAccount, user1]) => {
  let token;
  let exchange;
  const feePercent = 1;
  //before , itireate once through token.new()
  beforeEach(async () => {
    // Deploy token
    token = await Token.new();
    // Transfer some tokens to user1
    token.transfer(user1, tokens(100), { from: deployer });
    // Deploy exchange
    exchange = await Exchange.new(feeAccount, feePercent);
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

  describe("fallback", () => {
    it("reverts when Ether is sent", async () => {
      await exchange
        .fallBack({ value: 1, from: user1 })
        .should.be.rejectedWith(EVM_REVERT);
    });
  });

  describe("depositing ether", async () => {
    let result;
    let amount;

    beforeEach(async () => {
      amount = ether(1);
      result = await exchange.depositEther({ from: user1, value: amount });
    });

    it("tracks the ether deposit", async () => {
      const balance = await exchange.tokens(ETHER_ADDRESS, user1);
      balance.toString().should.equal(amount.toString());
    });

    it("emits a deposit event", async () => {
      const log = result.logs[0];
      log.event.should.eq("Deposit");
      const event = log.args;
      event.token.should.equal(ETHER_ADDRESS, "token address is correct");
      event.user.should.equal(user1, "user address is correct");
      event.amount
        .toString()
        .should.equal(amount.toString(), "amount is correct");
      event.balance
        .toString()
        .should.equal(amount.toString(), "balance is correct");
    });
  });

  describe("withdrawing Ether", async () => {
    let result;
    let amount;

    beforeEach(async () => {
      amount = ether(1);
      await exchange.depositEther({ from: user1, value: amount });
    });

    describe("success", async () => {
      beforeEach(async () => {
        //withdraw ether
        result = await exchange.withdrawEther(amount, { from: user1 });
      });

      beforeEach(async () => {
        it("withdraws Ether funds", async () => {
          const balance = await exchange.tokens(ETHER_ADDRESS, user1);
          balance.toString().should.equal("0");
        });
      });

      beforeEach(async () => {
        it("emits a 'Withdraw' event", async () => {
          const log = result.logs[0];
          log.event.should.equal("Withdraw");
          const event = log.args;
          //token feature check
          event.token.should.equal(ETHER_ADDRESS);
          event.user.should.equal(user1);
          event.amount.toString().should.equal(amount.toString());
          event.balance.toString().should.equal("0");
        });
      });
    });

    describe("failure", async () => {
      it("rejects withdraws for insufficient balances", async () => {
        await exchange.withdrawEther(ether(100), { from: user1 }).should.be //eth really at 1 so more than that ifc for testing
          .rejected;
      });
    });
  });

  describe("depositing tokens", () => {
    let result;
    let amount;

    describe("success", () => {
      beforeEach(async () => {
        amount = tokens(10);
        await token.approve(exchange.address, amount, { from: user1 });
        result = await exchange.depositToken(token.address, amount, {
          from: user1,
        });

        it("tracks token desposit", async () => {
          //check exchange token balance
          let balance;
          balance = await token.balanceOf(exchange.address);
          balance.toString().should.equal(amount.toString());
          // check tokens on exchange
          balance = await exchange.tokens(token.address, user1);
          balance.toString().should.equal(amount.toString());
        });

        it("emits a deposit event", async () => {
          const log = result.logs[0];
          log.event.should.eq("Deposit");
          const event = log.args;
          event.token.should.equal(token.address, "token address is correct");
          event.user.should.equal(user1, "user address is correct");
          event.amount
            .toString()
            .should.equal(tokens(10).toString(), "amount is correct");
          event.balance
            .toString()
            .should.equal(tokens(10).toString(), "balance is correct");
        });
      });
    });

    describe("failure", () => {
      it("rejects ether deposits", async () => {
        await exchange
          .depositToken(ETHER_ADDRESS, tokens(10), { from: user1 })
          .should.be.rejectedWith(EVM_REVERT);
      });

      it("fails when no tokens are approved", async () => {
        await exchange.depositToken(token.address, tokens(10), { from: user1 })
          .should.be.rejected;
      });
    });
  });

  describe("withdraws token funds", async () => {
    let result;
    let amount;

    describe("success", async () => {});
    beforeEach(async () => {
      //deposit token first
      amount = tokens(10);
      await token.approve(exchange.address, amount, { from: user1 });
      await exchange.depositToken(token.address, amount, { from: user1 });

      //withdraws token
      result = await exchange.withdrawToken(token.address, amount, {
        from: user1,
      });
    });

    it("withdraws token funds", async () => {
      const balance = await exchange.tokens(token.address, user1);
      balance.toString().should.equal("0");
    });

    it("emits a 'Withdraw' event", async () => {
      const log = result.logs[0];
      log.event.should.equal("Withdraw");
      const event = log.args;
      //token feature check
      event.token.should.equal(token.address);
      event.user.should.equal(user1);
      event.amount.toString().should.equal(amount.toString());
      event.balance.toString().should.equal("0");
    });
  });

  describe("failure", async () => {
    it("rejects ether withdraws", async () => {
      await exchange
        .withdrawToken(ETHER_ADDRESS, ether(10), { from: user1 })
        .should.be.rejectedWith(EVM_REVERT);
    });
    it("fails for insuficient balances", async () => {
      await exchange
        .withdrawToken(token.address, tokens(10), { from: user1 })
        .should.be.rejectedWith(EVM_REVERT);
    });
  });

  describe("checking the balance of token", async () => {
    beforeEach(async () => {
      await exchange.depositEther({ from : user1, value: ether(1)});
    });
    it("returns token balances", async () => {
      const result = await exchange.balanceOf(ETHER_ADDRESS, user1)
      result.toString().should.equal(ether(1).toString())
    })
  });
});