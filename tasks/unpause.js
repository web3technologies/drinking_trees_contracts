const getContract = require("./utils/getcontract");
const log4js = require("log4js");

log4js.configure({
  appenders: {
    out: { type: 'stdout' }, 
    success: { 
        type: "file", 
        filename: "./logs/setunpause/success.log" 
      },
    error: { 
          type: "file", 
          filename: "./logs/setunpause/error.log" 
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


async function unPause(){

    const nftContract = await getContract.getContract()
    try {
        await nftContract.setPaused(false);
        successLogger.info("Contract un paused")
    } catch (e){
        console.log(e)
        errorLogger.error(e)
    }

}



module.exports = {
    unPause: unPause
  }