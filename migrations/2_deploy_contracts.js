// eslint-disable-next-line no-undef
//const { artifacts } = require("truffle");
const TokenNBRCb = artifacts.require("TokenNBRCb");


module.exports = function (deployer) {
  deployer.deploy(TokenNBRCb);
};
