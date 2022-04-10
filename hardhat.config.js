require("@nomiclabs/hardhat-waffle");
require("dotenv").config();

const lottery = require("./tasks/lotterymint.js");
const adminuser = require("./tasks/setAdmins");
const unpause = require("./tasks/unpause");

const PRIVATEKEY = process.env.ACCOUNT1_PRIVATEKEY

task("lotterymint", "Mints for the n amount of lotterywinners")
  .setAction(async () => {
    console.log("*** LOTTERY MINT Task ***")
    await lottery.lotteryMint()
    console.log("!!! LOTTERY MINTED !!!")
  });

task("setAdmins", "Sets the initial admin users")
  .setAction(async () => {
    console.log("*** SET ADMIN Task ***")
    await adminuser.setAdminUsers()
    console.log("!!! ADMINS SET !!!")
  });

task("setUnPause", "Sets the unpause of the minting")
  .setAction(async () => {
    console.log("***SET UNPAUSE Task***")
    await unpause.unPause()
    console.log("!!! CONTRACT MINT UNPAUSED !!!")
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
