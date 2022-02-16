const { expect } = require("chai");
const { Console } = require("console");
const { ethers } = require("hardhat");


describe("NFT", function () {
  it("Should Deploy both contracts and run tests", async function () {
    const NFTMarket = await ethers.getContractFactory("NFTMarket");
    const DrinkingTrees = await ethers.getContractFactory("DrinkingTrees")

    const nftMarket = await NFTMarket.deploy();
    await nftMarket.deployed()
    const nft = await DrinkingTrees.deploy("DrinkingTrees", "DRT", "https://gateway.pinata.cloud/ipfs/", nftMarket.address);
    await nft.deployed()

    const nft1 = await nft.mint(1, {value: ethers.utils.parseEther("100.0")})
    const marketItem1 = await nftMarket.createMarketItem(nft.address, 1, ethers.utils.parseEther("100.00"), {value: ethers.utils.parseEther("0.025")})
    const marketItem1MarketSale = await nftMarket.createMarketSale(nft.address, 1, {value: ethers.utils.parseEther("100.00")})

    // const greeter = await Greeter.deploy("Hello, world!");
    // await greeter.deployed();

    // expect(await greeter.greet()).to.equal("Hello, world!");

    // const setGreetingTx = await greeter.setGreeting("Hola, mundo!");

    // // wait until the transaction is mined
    // await setGreetingTx.wait();

    // expect(await greeter.greet()).to.equal("Hola, mundo!");
  });
});
