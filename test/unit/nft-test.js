const { expect } = require("chai");
const BN = require("bn.js");
const { ethers, waffle } = require("hardhat");
const { BigNumber } = require('ethers');
const deployArgs = require("../../config/config")


describe("NFT Test", ()=>{

  before(async ()=> {

    [ owner, testAccount ] = await ethers.getSigners();

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

  })

  it("Contract should be unpaused", async ()=> {
    await nft.setPaused(false)
    expect((await nft.paused())).to.equal(false)
  })

  it("NFT supply should increase after mint", async ()=> {
    await nft.mint(1, {value: ethers.utils.parseEther(".02")})
    await nft.connect(owner).mint(1, {value: ethers.utils.parseEther(".02")})
    await nft.connect(owner).mint(1, {value: ethers.utils.parseEther(".02")})
    expect((await nft.totalSupply()).toString()).to.equal("3")
  })
  
});