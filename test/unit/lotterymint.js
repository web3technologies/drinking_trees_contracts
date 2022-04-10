const { expect } = require("chai");
const BN = require("bn.js");
const { ethers, waffle, run } = require("hardhat");
const { BigNumber } = require('ethers');
const deployArgs = require("../../config/config")
const csv = require("../../tasks/utils/readCSV.js");

describe("NFT Test", ()=>{

  before(async ()=> {

    [ owner, admin, nonAdmin ] = await ethers.getSigners();

    // deploy the nfts
    DrinkingTreesNFTContract = await ethers.getContractFactory("DrinkingTrees")
    nft = await DrinkingTreesNFTContract.deploy(...deployArgs.deployArgs);
    await nft.deployed()
  });

  it("Contract should have correct deploy state", async ()=> {

    expect((await nft.baseURI())).to.equal("")
    expect((await nft.baseExtension())).to.equal(".json")
    expect((await nft.hiddenMetadataUri())).to.equal(deployArgs.deployConfig.hiddenMetaDataURI)
    expect((await nft.cost())).to.equal(ethers.utils.parseEther(".0001"))
    expect((await nft.maxSupply())).to.equal(10000)
    expect((await nft.maxMintAmountPerTx())).to.equal(5)
    expect((await nft.paused())).to.equal(true)
    expect((await nft.revealed())).to.equal(false)
    expect((await nft.payoutAddress())).to.equal(process.env.PAYOUTADDRESS)
  })

  it("Should Run the Lottery Task and Count Mint", async ()=> {

    const task = await hre.run('lotterymint');
    expect((await nft.totalSupply())).to.equal(250)

  })

  it("Ensure that each wallet has an nft", async ()=> {

    const lotteryAddresses = await csv.readCSV("./static/lotteryaddresses.csv")
    for(let i = 0; i<lotteryAddresses.length; i++){
        const wallet = await nft.walletOfOwner(lotteryAddresses[i]);
        expect((wallet.length)).to.equal(1)
    }

  })

  
});