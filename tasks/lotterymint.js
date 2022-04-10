const csv = require("./utils/readcsv.js");
const getContract = require("./utils/getcontract");
const log4js = require("log4js");


log4js.configure({
  appenders: {
    out: { type: 'stdout' }, 
    success: { 
        type: "file", 
        filename: "./logs/lotterymint/success.log" 
      },
    error: { 
          type: "file", 
          filename: "./logs/lotterymint/error.log" 
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

const logger = log4js.getLogger()
const successLogger = log4js.getLogger("success");
const errorLogger = log4js.getLogger("error");

// This task will be used to mint all of the first 250 NFTs to a users address
// calls the contracts mintForAddress method itteratively
async function mint(){
    console.log("")
    successLogger.info("Minting")
    logger.info("Minting")
    const nftContract = await getContract.getContract()
    const lotteryAddresses = await csv.readCSV("./static/lotteryaddresses.csv")

    for(let i = 0; i<lotteryAddresses.length; i++){
        try {
            const mintToken = await nftContract.mintForAddress(1, lotteryAddresses[i]);
            logger.info(`Minted for address: ${lotteryAddresses[i]} -- Number ${i}`)
            successLogger.info(`Minted for address: ${lotteryAddresses[i]} -- Number ${i}`)
        } catch (e){
            errorLogger.error(e + "---" + lotteryAddresses[i])
        }

    }

    
    successLogger.info("Successful Mint")

}

// main function
async function lotteryMint(){
    await mint()
};


module.exports = {
    lotteryMint: lotteryMint
  }