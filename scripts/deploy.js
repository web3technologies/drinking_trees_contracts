const hre = require("hardhat");
const fs = require('fs');
const process = require('process');
const path = require('path');
const fse = require('fs-extra');
const AWS = require("aws-sdk")
const deployArgs = require("../config/config")

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

const logger = log4js.getLogger()
const successLogger = log4js.getLogger("success");
const errorLogger = log4js.getLogger("error");


async function main() {
    successLogger.info("***Deploy SCRIPT***")

    successLogger.info("Deploying NFT")
    const NFT = await hre.ethers.getContractFactory("DrinkingTrees")


    const nft = await NFT.deploy(...deployArgs.deployArgs);
    await nft.deployed();
    successLogger.info("NFT deployed to: ", nft.address)
    const addressDataNFT = {
        contractName: "DrinkingTrees",
        address: nft.address
    }
    const jsonContentNFT = JSON.stringify(addressDataNFT)
    
    const baseDirPath = "/artifacts/contracts/address/"

    if (!fs.existsSync(process.cwd() + baseDirPath)){
      fs.mkdirSync(process.cwd() + baseDirPath);
    }
    fs.writeFileSync(process.cwd() + `/artifacts/contracts/address/DrinkingTrees.json`, jsonContentNFT, "utf8", err => console.log(err))

    await fullSend()
}


const uploadToS3Bucket = (image, filePath) => {
  return new Promise((resolve, reject) => {
    let s3 = new AWS.S3({
      accessKeyId: process.env.S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
      // region: process.env.S3_REGION,
    });

    const bucketName = process.env.S3_BUCKET_NAME;

    let bucketPath = filePath;

    let params = {
      Bucket: bucketName,
      Key: bucketPath,
      Body: image,
    };

    s3.putObject(params, (err, data) => {
      if (err) {
        console.log(err);
      } else {
        console.log('success: ', filePath)
        resolve();
      }
    });
  });
};


async function fullSend(){
    
    const contractEnv = process.env.CONTRACT_ENV

    console.log("uploading addresses")
    const drinkingTreesJson = process.cwd() + "/artifacts/contracts/address/DrinkingTrees.json"
    await uploadToS3Bucket(fs.readFileSync(drinkingTreesJson), `${contractEnv}/contracts/address/DrinkingTrees.json`)
    
    console.log("uploading contract data")
    const drinkingTreesSol = process.cwd() + "/artifacts/contracts/DrinkingTrees.sol/DrinkingTrees.dbg.json"
    const drinkingTreesSolJson = process.cwd() + "/artifacts/contracts/DrinkingTrees.sol/DrinkingTrees.json"
    await uploadToS3Bucket(fs.readFileSync(drinkingTreesSol), `${contractEnv}/contracts/DrinkingTrees.sol/DrinkingTrees.dbg.json`)
    await uploadToS3Bucket(fs.readFileSync(drinkingTreesSolJson), `${contractEnv}/contracts/DrinkingTrees.sol/DrinkingTrees.json`)



}




function moveArtifacts(){


    let parent = path.resolve(__dirname, '..')
    const frontEndPath = path.resolve(parent, "../drinking_trees_frontend")
    fse.copySync(process.cwd() + "/artifacts", frontEndPath + "/artifacts");

    const adminPath = path.resolve(parent, "../drinking_trees_admin")
    fse.copySync(process.cwd() + "/artifacts", adminPath + "/artifacts");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });