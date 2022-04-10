const getContract = require("./utils/getcontract");
const baseURI = process.env.BASE_URI

const log4js = require("log4js");

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

// function to set the base uri for the nfts and the set reveal to true
async function setReveal(){

    const nftContract = await getContract.getContract()
    try {
        await nftContract.setBaseURI(baseURI);
        successLogger.info("Base URI Has been set to: " + baseURI)
        await nftContract.setRevealed(true);
        successLogger.info("Contract has been set to revealed")
    } catch (e){
        errorLogger.error(e)
    }

}



module.exports = {
    setReveal: setReveal
  }