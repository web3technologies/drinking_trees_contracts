require("@nomiclabs/hardhat-waffle");
require("dotenv").config();
const lottery = require("./tasks/lotterymint.js");

const PRIVATEKEY = process.env.ACCOUNT1_PRIVATEKEY

task("lotterymint", "Mints for the n amount of lotterywinners")
  .setAction(async () => {
    console.log("***LotteryMint Task***")
    await lottery.lotteryMint()
  });


module.exports = {
  networks: {
    hardhat: {
      chainId: 1337,
      accounts: [{
        privateKey: PRIVATEKEY,
        balance: "10000000000000000000000",
      }]
    },
    mumbai: {
      url: `https://rpc-mumbai.maticvigil.com`,
      chainId: 80001,
      accounts: [PRIVATEKEY]
    },
  },
  solidity: "0.8.4",
};
