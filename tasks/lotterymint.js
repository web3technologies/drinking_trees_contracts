const axios = require('axios');


// function to fetch all of the data from aws s3 for the contracts
// will return and object with the abis and the address of the contract
async function fetchContractData() {

    const urlBase = `${process.env.S3_BUCKET_URL}${process.env.CONTRACT_ENV}`

    try {
        const contractAddressData = await axios.get(`${urlBase}/contracts/address/DrinkingTrees.json`)
        const contractAbis = await axios.get(`${urlBase}/contracts/DrinkingTrees.sol/DrinkingTrees.json`);

        return {
            address: contractAddressData.data,
            abi: contractAbis.data
        }

    } catch (err){
        console.log("Error")
        console.log(err)
    }
    

}



async function lotteryMint(){

    console.log('Fetching Contracts')
    const contractData = await fetchContractData()
    // console.log(contractData.abi)
    console.log(contractData.address)
};


module.exports = {
    lotteryMint: lotteryMint
  }