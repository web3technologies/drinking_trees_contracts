const hre = require("hardhat");
const fs = require('fs');
const process = require('process');
const path = require('path');
const fse = require('fs-extra');

async function main() {

    const NFTMarket = await hre.ethers.getContractFactory("NFTMarket");
    const nftMarket = await NFTMarket.deploy();
    await nftMarket.deployed()
    console.log("nftMarket deployed to: ", nftMarket.address)
    const addressDataMarket = {
      contractName: "NFtMarket",
      address: nftMarket.address
  }
  const jsonContentMarket = JSON.stringify(addressDataMarket)
  
    


    const NFT = await hre.ethers.getContractFactory("DrinkingTrees")
    const nft = await NFT.deploy("DrinkingTrees", "DRT", "https://gateway.pinata.cloud/ipfs/", nftMarket.address);
    await nft.deployed();

    console.log()
    console.log('Deployed from')
    console.log(nft.deployTransaction.from)
    console.log("nft deployed to: ", nft.address)
    const addressDataNFT = {
        contractName: "DrinkingTrees",
        address: nft.address
    }
    const jsonContentNFT = JSON.stringify(addressDataNFT)
    
    const baseDirPath = "/artifacts/contracts/address/"
    fs.mkdirSync(process.cwd() + baseDirPath)
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