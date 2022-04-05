require("@nomiclabs/hardhat-waffle");
const fs = require("fs")
require("dotenv").config()

const privateKey = process.env.ACCOUNT1_PRIVATEKEY

module.exports = {
  networks: {
    hardhat: {
      chainId: 1337
    },
    mumbai: {
      url: `https://rpc-mumbai.maticvigil.com`,
      chainId: 80001,
      accounts: [privateKey]
    },
  },
  solidity: "0.8.4",
};
