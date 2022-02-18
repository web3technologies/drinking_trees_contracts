const hre = require("hardhat");
const fs = require('fs');
const process = require('process');
const path = require('path');
const fse = require('fs-extra');

const withdrawAddress = process.env.WITHDRAW_ADDRESS

async function main() {
    console.log("***Deploy SCRIPT***")
    console.log()
    console.log("Deploying Bank")
    const DrinkingTreesBank = await hre.ethers.getContractFactory("DrinkingTreesBank");
    const drinkingTreesBank = await DrinkingTreesBank.deploy(withdrawAddress); 
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
    moveArtifacts()
    

}

function moveArtifacts(){

    let parent = path.resolve(__dirname, '..')
    const frontEndPath = path.resolve(parent, "../drinking_trees_frontend")
    fse.copySync(process.cwd() + "/artifacts", frontEndPath + "/artifacts");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });