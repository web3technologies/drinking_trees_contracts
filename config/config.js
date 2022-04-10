const { ethers } = require("hardhat");

const deployConfig = {
    tokenName: "Drinking Trees",
    tokenSymbol: "DRT",
    maxAmountPerTransaction: 5,
    hiddenMetaDataURI: "ipfs://QmPvgdkcXHVEqgL9427bEKef18GW92XR8zpvPW1NKmnefu/hidden.json",
    cost: ethers.utils.parseEther(process.env.COST),
    payoutAddress: process.env.PAYOUTADDRESS
}

const deployArgs = [
    deployConfig.tokenName,
    deployConfig.tokenSymbol,
    deployConfig.maxAmountPerTransaction,
    deployConfig.hiddenMetaDataURI,
    deployConfig.cost,
    deployConfig.payoutAddress
  ]


module.exports = {
    deployArgs: deployArgs,
    deployConfig: deployConfig
  }