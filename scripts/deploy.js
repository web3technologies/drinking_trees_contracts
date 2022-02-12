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
    // console.log("nft deployed to: ", nft.address);
    // console.log("moving artifacts...")
    let parent = path.resolve(__dirname, '..')
    const frontEndPath = path.resolve(parent, "../drinking_trees_frontend")
    console.log(parent)
    // // console.log(path.resolve(parent, "/drinking_trees_frontend"))

    // console.log("this: ", path.dirname(process.cwd()).split(path.sep).pop())
    // console.log("new: ", path.join(process.cwd() + "../drinking_trees_contracts/"))
    // // let frontEndPath = path.join(path.join(process.cwd() + "../drinking_trees/drinking_trees_frontend"))
    // console.log("frontend path, :L ", frontEndPath)
    // // frontEndPath = path.resolve(frontEndPath)
    // console.log("here")
    // fs.copyFile(path.resolve(`${process.cwd()}/artifacts`), frontEndPath + "/pages", (err)=> {
    //     if (err){
    //         console.log("err")
    //         throw (err)
    //     }
    //     else{
    //         console.log("copied?")
    //     }
    // });

    // console.log("end")

    // To copy a folder or file
    console.log('copying')
    console.log(frontEndPath)
    // const source =  "C:/Users/Crypto Thoughts/Desktop/dev/crypto/drinking_trees/drinking_trees_contracts/artifacts"
    // const destination =  "C:/Users/Crypto Thoughts/Desktop/dev/crypto/drinking_trees/drinking_trees_frontend"
    console.log()
    fse.copySync(process.cwd() + "/artifacts", process.cwd() + "../drinking_trees_frontend");
    
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });