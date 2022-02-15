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

    const NFT = await hre.ethers.getContractFactory("DrinkingTrees")
    const nft = await NFT.deploy("DrinkingTrees", "DRT", "https://gateway.pinata.cloud/ipfs/");
    await nft.deployed();

    console.log(nft.deployTransaction.from)
    console.log(nft.address)
    // console.log(JSON.stringify(nft, null, 4));

    const contractName = "DrinkingTrees"

    const addressData = {
        contractName: contractName,
        address: nft.address
    }
    
    const jsonContent = await JSON.stringify(addressData)
    // fs.writeFileSync(process.cwd() + `/artifacts/contracts/address/${contractName}.json`, jsonContent, "utf8", err => console.log(err))

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