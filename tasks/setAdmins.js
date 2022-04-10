const csv = require("./utils/readcsv.js");
const getContract = require("./utils/getcontract");
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

async function setAdminUsers(){

    const admins = await csv.readCSV("./static/adminaddresses.csv")
    const nftContract = await getContract.getContract()

    for (let i =0; i<admins.length; i++){

        try {
            await nftContract.setAdmin(admins[i])
            console.log(`Admin set at: ${admins[i]}`)
            successLogger.info(`Admin set at: ${admins[i]}`)
        } catch (e){
            errorLogger.error(e + " -- " + admins[i])
        }
        
    }
    
}



module.exports = {
    setAdminUsers: setAdminUsers
  }