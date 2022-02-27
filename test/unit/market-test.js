const { expect } = require("chai");
const BN = require("bn.js");
const { ethers, waffle } = require("hardhat");
const { BigNumber } = require('ethers');


describe("Market Test", ()=>{

  before(async ()=> {

    [ owner, miriamAccount, danAccount, zachCookAccount, raymondAccount, zachComAccount, charityAccount, testAccount ] = await ethers.getSigners();

    // deploy the bank
    DrinkingTreesBankContract = await ethers.getContractFactory("DrinkingTreesBank")
    drinkingTreesBank = await DrinkingTreesBankContract.deploy(
      miriamAccount.address,
      danAccount.address,
      zachCookAccount.address,
      raymondAccount.address,
      zachComAccount.address,
      charityAccount.address
    )
    await drinkingTreesBank.deployed()
    
    //deploy the market
    NFTMarketContract = await ethers.getContractFactory("NFTMarket");
    nftMarket = await NFTMarketContract.deploy(drinkingTreesBank.address);
    await nftMarket.deployed()
    
    // deploy the nfts
    DrinkingTreesNFTContract = await ethers.getContractFactory("DrinkingTrees")
    nft = await DrinkingTreesNFTContract.deploy(
      "DrinkingTrees", 
      "DRT", 
      "https://gateway.pinata.cloud/ipfs/", 
      nftMarket.address, 
      drinkingTreesBank.address
    );
    await nft.deployed()
  });
  
});