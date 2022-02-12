require("@nomiclabs/hardhat-waffle");
const fs = require("fs")
require("dotenv").config()

const privateKey = process.env.ACCOUNT1_PRIVATEKEY
projectId = "50c33544dad04cfe9bdda7f3caa2142a"



module.exports = {
  networks: {
    hardhat: {
      chainId: 1337
    },
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${projectId}`,
      chainId: 4,
      accounts: [privateKey]
    },
    mainnet: {
      url: `https://mainnet.infura.io/v3/${projectId}`,
      chainId: 1,
      accounts: [privateKey]
    }
  },
  solidity: "0.8.4",
};
