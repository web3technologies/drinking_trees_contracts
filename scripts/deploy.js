const hre = require("hardhat");
const fs = require('fs');
const process = require('process');
const path = require('path');
const fse = require('fs-extra');

async function main() {
  // const NFTMarket = await hre.ethers.getContractFactory("NFTMarket");
  // const nftMarket = await NFTMarket.deploy();
  // await nftMarket.deployed()
  // console.log("nftMarket deployed to: ", nftMarket.address)

  // const NFT = await hre.ethers.getContractFactory("NFT")
  // const nft = await NFT.deploy(nftMarket.address);
  // await nft.deployed();
  // console.log("nft deployed to: ", nft.address);


    const NFT = await hre.ethers.getContractFactory("DrinkingTrees")
    const nft = await NFT.deploy("DrinkinTrees", "DRT", "https://gateway.pinata.cloud/ipfs/");
    await nft.deployed();
    moveArtifacts(nft)

}

function moveArtifacts(nft){
    let parent = path.resolve(__dirname, '..')
    const frontEndPath = path.resolve(parent, "../drinking_trees_frontend")
    fse.copySync(process.cwd() + "/artifacts/contracts", frontEndPath + "/artifacts");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });