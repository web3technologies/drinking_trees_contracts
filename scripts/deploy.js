const hre = require("hardhat");
const fs = require('fs');
const process = require('process');
const path = require('path');
const fse = require('fs-extra');
const AWS = require("aws-sdk")

const miriamAddress = "0x47C1d00FF2f675232CdC3CC39EBBabFF37c04375"
const danAddress = "0x47C1d00FF2f675232CdC3CC39EBBabFF37c04375"
const zachCookAddress = "0x47C1d00FF2f675232CdC3CC39EBBabFF37c04375"
const raymondAddress = "0x47C1d00FF2f675232CdC3CC39EBBabFF37c04375"
const zachComAddress = "0x47C1d00FF2f675232CdC3CC39EBBabFF37c04375"
const charityAddress = "0x47C1d00FF2f675232CdC3CC39EBBabFF37c04375"



async function main() {
    console.log("***Deploy SCRIPT***")
    console.log()
    console.log("Deploying Bank")
    const DrinkingTreesBank = await hre.ethers.getContractFactory("DrinkingTreesBank");
    const drinkingTreesBank = await DrinkingTreesBank.deploy(
      miriamAddress,
      danAddress,
      zachCookAddress,
      raymondAddress,
      zachComAddress,
      charityAddress,
      charityAddress
    ); 
    await drinkingTreesBank.deployed();
    console.log(`Bank address: ${drinkingTreesBank.address}`)
    console.log()
    const addressDataBank = {
      contractName: "DrinkingTreesBank",
      address: drinkingTreesBank.address
    }
    const jsonContentBank = JSON.stringify(addressDataBank)


    console.log("Deploying Market")
    const NFTMarket = await hre.ethers.getContractFactory("NFTMarket");
    const nftMarket = await NFTMarket.deploy(drinkingTreesBank.address);
    await nftMarket.deployed()
    console.log("NFTMarket deployed to: ", nftMarket.address)
    console.log()
    const addressDataMarket = {
      contractName: "NFtMarket",
      address: nftMarket.address
    }
    const jsonContentMarket = JSON.stringify(addressDataMarket)

    console.log("Deploying NFT")
    const NFT = await hre.ethers.getContractFactory("DrinkingTrees")
    const nft = await NFT.deploy("DrinkingTrees", "DRT", "https://gateway.pinata.cloud/ipfs/", nftMarket.address, drinkingTreesBank.address);
    await nft.deployed();
    console.log("NFT deployed to: ", nft.address)
    const addressDataNFT = {
        contractName: "DrinkingTrees",
        address: nft.address
    }
    const jsonContentNFT = JSON.stringify(addressDataNFT)
    
    const baseDirPath = "/artifacts/contracts/address/"

    if (!fs.existsSync(process.cwd() + baseDirPath)){
      fs.mkdirSync(process.cwd() + baseDirPath);
    }
    fs.writeFileSync(process.cwd() + `/artifacts/contracts/address/DrinkingTreesBank.json`, jsonContentBank, "utf8", err => console.log(err))
    fs.writeFileSync(process.cwd() + `/artifacts/contracts/address/DrinkingTrees.json`, jsonContentNFT, "utf8", err => console.log(err))
    fs.writeFileSync(process.cwd() + `/artifacts/contracts/address/NFTMarket.json`, jsonContentMarket, "utf8", err => console.log(err))

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

    s3.putObject(params, function (err, data) {
      if (err) {
        console.log(err);
      } else {
        console.log('success')
        resolve();
      }
    });
  });
};


async function fullSend(){
    
    const contractEnv = process.env.CONTRACT_ENV

    console.log("uploading addresses")
    const drinkingTreesJson = process.cwd() + "/artifacts/contracts/address/DrinkingTrees.json"
    const drinkingTreesBankJson = process.cwd() + "/artifacts/contracts/address/DrinkingTreesBank.json"
    const nftMarketJson = process.cwd() + "/artifacts/contracts/address/NFTMarket.json"
    await uploadToS3Bucket(fs.readFileSync(drinkingTreesJson), `${contractEnv}/contracts/address/DrinkingTrees.json`)
    await uploadToS3Bucket(fs.readFileSync(drinkingTreesBankJson), `${contractEnv}/contracts/address/DrinkingTreesBank.json`)
    await uploadToS3Bucket(fs.readFileSync(nftMarketJson), `${contractEnv}/contracts/address/NFTMarket.json`)
    
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