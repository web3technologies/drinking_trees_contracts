const csv = require("./utils/readCSV.js");
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
    console.log("Minting")
    try {
        const nftContract = await getContract.getContract()
        const lotteryAddresses = await csv.readCSV("./static/lotteryaddresses.csv")
        for(let i = 0; i<lotteryAddresses.length; i++){
            const mintToken = await nftContract.mintForAddress(1, lotteryAddresses[i]);
            logger.info(`Minted for address: ${lotteryAddresses[i]} -- Number ${i}`)
            successLogger.info(`Minted for address: ${lotteryAddresses[i]} -- Number ${i}`)
        }
        successLogger.info("Successful Mint")
    } catch(e){
        console.log(e)
        console.log("error")
        errorLogger.trace("Entering cheese testing");
        errorLogger.debug("Got cheese.");
        errorLogger.warn("Cheese is quite smelly.");
        errorLogger.error("Cheese is too ripe!");
        errorLogger.fatal("Cheese was breeding ground for listeria.");
    }

}

// main function
async function lotteryMint(){
    await mint()
};


module.exports = {
    lotteryMint: lotteryMint
  }