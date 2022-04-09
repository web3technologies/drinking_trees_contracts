require("@nomiclabs/hardhat-waffle");
const fs = require("fs");
require("dotenv").config();
const lottery = require("./tasks/lotterymint.js");

const privateKey = process.env.ACCOUNT1_PRIVATEKEY

task("lotterymint", "Mints for the n amount of lotterywinners")
  .setAction(async () => {

    await lottery.lotteryMint()

  });




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
