const { expect } = require("chai");
const BN = require("bn.js");
const { ethers, waffle } = require("hardhat");
const { BigNumber } = require('ethers');


describe("Bank Test", ()=>{

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

  // beforeEach(async () =>{
  //   // await nft.mint() // mint from owner which requires no value
  //   await nft.connect(testAccount).mint({value: ethers.utils.parseEther(".02")}) // mint from non owner which requires value
  // })

  // it("Bank owner should be owner", async ()=> {
  //   expect((await drinkingTreesBank.owner())).to.equal(owner.address)
  // })

  // it("Market owner should be owner", async ()=> {
  //   expect((await drinkingTreesBank.owner())).to.equal(owner.address)
  // })

  // it("NFT owner should be owner", async ()=> {
  //   expect((await drinkingTreesBank.owner())).to.equal(owner.address)
  // })

  it("The Shareholder Count should be 6", async ()=>{
    expect((await drinkingTreesBank.shareHolderCount()).toString()).to.equal("6")
  })

  it("Shareholder should match input", async ()=> {

    const miriamShareHolder = await drinkingTreesBank.shareHolders("miriam")
    expect(miriamShareHolder.username).to.equal("miriam")
    expect(miriamShareHolder.wallet).to.equal(miriamAccount.address)
    expect(BigNumber.from(miriamShareHolder.equityPercent).toString()).to.equal("2100")

    const danShareHolder = await drinkingTreesBank.shareHolders("dan") 
    expect(danShareHolder.username).to.equal("dan")
    expect(danShareHolder.wallet).to.equal(danAccount.address)
    expect(BigNumber.from(danShareHolder.equityPercent).toString()).to.equal("2100")

    const zachCookShareHolder = await drinkingTreesBank.shareHolders("zachcook")
    expect(zachCookShareHolder.username).to.equal("zachcook")
    expect(zachCookShareHolder.wallet).to.equal(zachCookAccount.address)
    expect(BigNumber.from(zachCookShareHolder.equityPercent).toString()).to.equal("2100") 

    const raymondShareHolder = await drinkingTreesBank.shareHolders("raymond")
    expect(raymondShareHolder.username).to.equal("raymond")
    expect(raymondShareHolder.wallet).to.equal(raymondAccount.address)
    expect(BigNumber.from(raymondShareHolder.equityPercent).toString()).to.equal("2100") 

    const zachComShareHolder = await drinkingTreesBank.shareHolders("zachcom")
    expect(zachComShareHolder.username).to.equal("zachcom")
    expect(zachComShareHolder.wallet).to.equal(zachComAccount.address)
    expect(BigNumber.from(zachComShareHolder.equityPercent).toString()).to.equal("600") 

    const charityShareHolder = await drinkingTreesBank.shareHolders("charity")
    expect(charityShareHolder.username).to.equal("charity")
    expect(charityShareHolder.wallet).to.equal(charityAccount.address)
    expect(BigNumber.from(charityShareHolder.equityPercent).toString()).to.equal("1000")

  })

  it("Get all Shareholders", async()=>{
    const shareHolders = await drinkingTreesBank.getAllShareHolders()
    expect(shareHolders.length).to.equal(6)
    const firstShareHolder = shareHolders[0]
    expect(firstShareHolder.username).to.equal("miriam")
    expect(firstShareHolder.wallet).to.equal(miriamAccount.address)
    expect(BigNumber.from(firstShareHolder.equityPercent).toString()).to.equal("2100")

  })


  it(`Bank Balance after 2 total mints should be .04`, async ()=>{
    await nft.connect(testAccount).mint({value: ethers.utils.parseEther(".02")})
    await nft.connect(testAccount).mint({value: ethers.utils.parseEther(".02")})
    const provider = waffle.provider;
    let bankBalance = await provider.getBalance(drinkingTreesBank.address)
    bankBalance = BigNumber.from(bankBalance).toString()
    expect(bankBalance).to.equal(ethers.utils.parseEther(".04"))
  })

  it("Withdraw should transfer the correct ammounts and bank should be 0.0", async()=>{
    
    const provider = waffle.provider;
    const miriamShareHolder = await drinkingTreesBank.shareHolders("miriam")

    let miriamBalanceBefore = await provider.getBalance(miriamShareHolder.wallet)
    miriamBalanceBefore = BigNumber.from(miriamBalanceBefore)
    
    let bankBalanceBefore = await provider.getBalance(drinkingTreesBank.address)
    bankBalanceBefore = BigNumber.from(bankBalanceBefore)

    await drinkingTreesBank.withdraw()
    
    const payout = bankBalanceBefore * .21
    let miriamBalanceAfter = await provider.getBalance(miriamShareHolder.wallet)
    miriamBalanceAfter = BigNumber.from(miriamBalanceAfter)
    expect(miriamBalanceAfter).to.equal(miriamBalanceBefore.add(payout))


    let bankBalanceafter = await provider.getBalance(drinkingTreesBank.address)
    bankBalanceafter = BigNumber.from(bankBalanceafter)
    bankBalanceafter = ethers.utils.formatEther(bankBalanceafter)
    expect(bankBalanceafter).to.equal("0.0")
  })


})
