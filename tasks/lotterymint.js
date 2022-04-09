const axios = require('axios');
// require("hardhat")

const PRIVATEKEY = process.env.ACCOUNT1_PRIVATEKEY

// function to fetch all of the data from aws s3 for the contracts
// will return and object with the abis and the address of the contract
async function fetchContractData() {
    console.log('')
    console.log("Fetching Contracts")
    const urlBase = `${process.env.S3_BUCKET_URL}${process.env.CONTRACT_ENV}`

    try {
        const contractAddressData = await axios.get(`${urlBase}/contracts/address/DrinkingTrees.json`)
        const contractAbis = await axios.get(`${urlBase}/contracts/DrinkingTrees.sol/DrinkingTrees.json`);
        console.log("Success")
        return {
            address: contractAddressData.data.address,
            abi: contractAbis.data
        }

    } catch (err){
        console.log("Error")
        console.log(err)
    }
    

}

async function mint(contractData){
    console.log("")
    console.log("Minting")
    try {

        const provider = new ethers.providers.JsonRpcProvider(process.env.PROVIDER_URL)
        const signer = new ethers.Wallet(PRIVATEKEY, provider)
        const nftContract = new ethers.Contract(contractData.address, contractData.abi.abi, signer);
        let mintedCount = 1;
        while (mintedCount < 251){
            const mintToken = await nftContract.mint(1, { value: ethers.utils.parseEther(".0001")});
            console.log("Minted for address: ")
            mintedCount ++;   
        }
        console.log("Successful Mint")
        
    } catch(e){
        console.log(e)
        console.log("error")
    }

}



async function lotteryMint(){

    const contractData = await fetchContractData()
    await mint(contractData)
};


module.exports = {
    lotteryMint: lotteryMint
  }