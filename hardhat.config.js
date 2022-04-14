require("@nomiclabs/hardhat-waffle");
require("dotenv").config();
require("@nomiclabs/hardhat-etherscan");

const lottery = require("./tasks/lotterymint.js");
const adminuser = require("./tasks/setAdmins");
const unpause = require("./tasks/unpause");
const reveal = require("./tasks/setReveal");
const verify = require("./tasks/verify");


const PRIVATEKEY = process.env.ACCOUNT1_PRIVATEKEY
const PRIVATEKEY2 = process.env.ACCOUNT2_PRIVATEKEY
const PRIVATEKEY3 = process.env.ACCOUNT3_PRIVATEKEY

task("lotterymint", "Mints for the n amount of lotterywinners")
  .setAction(async (taskArgs) => {
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

  task("verifyContract", "Sets the unpause of the minting")
  .setAction(async () => {
    console.log("***Verify Task***")
    await verify.verify()
    console.log("!!! CONTRACT Verified !!!")
  });

task("setReveal", "Sets the revealing of the nfts and the BaseUri")
  .setAction(async () => {
    console.log("***SET REVEAL Task***")
    await reveal.setReveal()
    console.log("!!! CONTRACT REVEALED !!!")
  });


POLYGON_MUMBAI_RPC_PROVIDER = 'https://rpc-mumbai.maticvigil.com'
POLYGONSCAN_API_KEY = 'V5JXY7Z33HVI1JQSNCDA6C59FDCYE8ZWU6'

module.exports = {
  networks: {
    hardhat: {
      chainId: 1337,
      accounts: [
        {
          privateKey: PRIVATEKEY,
          balance: "10000000000000000000000"
        },
        {
          privateKey: PRIVATEKEY2,
          balance: "10000000000000000000000"
        },
        {
          privateKey: PRIVATEKEY3,
          balance: "10000000000000000000000"
        }
      ]
    },
    mumbai: {
      url: `https://rpc-mumbai.maticvigil.com`,
      chainId: 80001,
      accounts: [PRIVATEKEY]
    },
    ropsten: {
      url: "https://ropsten.infura.io/v3/6371b6cc89d940feb1557175b7978ced",
      chainid: 3,
      accounts: [PRIVATEKEY]
    }
  },
  solidity: "0.8.4",
  etherscan: {
    apiKey: {
      ropsten: "RZXB4EUNI9U269B1P7HIU5XK89FWG67TV8"
    }
  }
};
