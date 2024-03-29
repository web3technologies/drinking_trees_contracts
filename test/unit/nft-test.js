const { expect } = require("chai");
const BN = require("bn.js");
const { ethers, waffle } = require("hardhat");
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

  it("Ensure that admins in the csv are being set", async ()=> {
    const task = await hre.run('setAdmins');
    const adminAddresses = await csv.readCSV("./static/adminaddresses.csv")
    const contractAdmins = await nft.getAdmins()
    for(let i = 0; i<adminAddresses.length; i++){
        expect((contractAdmins.includes(adminAddresses[i]))).to.equal(true)
    }

  it("Ensure that the minting is being unpaused", async ()=> {
      const task = await hre.run('setUnPause');
      expect((await nft.paused())).to.equal(false)
    })

  })

  it("Ensure that the base uri is being set and the reveal is true", async ()=> {
    const task = await hre.run('setReveal');
    expect((await nft.baseURI())).to.equal(process.env.BASE_URI)
    expect((await nft.revealed())).to.equal(true)
  })


  it("Should set an admin user", async ()=> {
    const admintoAdd = await admin.getAddress()
    await nft.setAdmin(admintoAdd)
    const currentAdmins = await nft.getAdmins()
    expect((currentAdmins[0])).to.equal(admintoAdd) 
    expect((currentAdmins.length)).to.equal(5)
  })
  
  it("Should deny set of contract address with non admin or owner", async ()=> {
    const newPayout = await owner.getAddress()
    await expect(
      nft.connect(nonAdmin).setPayoutAddress(newPayout)
    ).to.be.revertedWith('You must be an admin user to call this function')
  })

  it("Should set payout contract address with admin user", async ()=> {
    const newPayout = await owner.getAddress()
    await nft.connect(admin).setPayoutAddress(newPayout)
    expect((await nft.payoutAddress())).to.equal(newPayout)
  })

  it("Should correctly set payout address with owner", async ()=> {
    const newPayout = await admin.getAddress()
    await nft.setPayoutAddress(newPayout)
    expect((await nft.payoutAddress())).to.equal(newPayout)
  })

  it("Should deny set baseURI", async ()=> {
    await expect(
      nft.connect(nonAdmin).setBaseURI(process.env.BASE_URI)
    ).to.be.revertedWith('You must be an admin user to call this function')
  })

  it("Should correctly set baseURI", async ()=> {
    await nft.connect(admin).setBaseURI(process.env.BASE_URI)
    expect((await nft.baseURI())).to.equal(process.env.BASE_URI)
  })


  it("MintForAddress test for owner to be able to mint before un paused", async ()=> {
    const addy = await admin.getAddress()
    await nft.mintForAddress(1, addy)
    expect((await nft.totalSupply()).toString()).to.equal("251")
  })

  it("Contract should be unpaused", async ()=> {
    await nft.setPaused(false)
    expect((await nft.paused())).to.equal(false)
  })

  it("NFT supply should increase after mint", async ()=> {
    await nft.mint(1, {value: ethers.utils.parseEther(".0001")})
    await nft.connect(admin).mint(1, {value: ethers.utils.parseEther(".0001")})
    await nft.connect(admin).mint(1, {value: ethers.utils.parseEther(".0001")})
    expect((await nft.totalSupply()).toString()).to.equal("254")
  })
  
});