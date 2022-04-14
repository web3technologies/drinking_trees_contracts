const { ethers } = require("ethers");
const getContract = require("./utils/getcontract");
// const deployArgs = require("../config/config");
const log4js = require("log4js");

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


log4js.configure({
  appenders: {
    out: { type: 'stdout' }, 
    success: { 
        type: "file", 
        filename: `${process.cwd()}/logs/success.log` 
      },
    error: { 
          type: "file", 
          filename: `${process.cwd()}/logs/error.log` 
        } 
    },
  categories: {

    default: { appenders: [ 'out' ], level: 'trace' },

    success: { 
        appenders: ["success"], 
        level: "info" 
    },
    error: { 
        appenders: ["error"], 
        level: "error" 
        } 
    }
});

const successLogger = log4js.getLogger("success");
const errorLogger = log4js.getLogger("error");


async function verify(){

    const nftContract = await getContract.getContract()
    const address = await nftContract.address
    successLogger.info("VerifyingContract")
    try {
        await hre.run("verify:verify", {
            address: address,
            constructorArguments: deployArgs,
          });
          successLogger.info("Contract Verified")
    } catch(e){
        errorLogger.error(e)
    }


}



module.exports = {
    verify: verify
  }