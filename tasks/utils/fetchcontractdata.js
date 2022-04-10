const axios = require('axios');


// function to fetch all of the data from aws s3 for the contracts
// will return and object with the abis and the address of the contract
async function fetchContractData() {
    console.log('')
    console.log("Fetching Contracts...")
    const urlBase = `${process.env.S3_BUCKET_URL}${process.env.CONTRACT_ENV}`

    try {
        const contractAddressData = await axios.get(`${urlBase}/contracts/address/DrinkingTrees.json`)
        const contractAbis = await axios.get(`${urlBase}/contracts/DrinkingTrees.sol/DrinkingTrees.json`);
        console.log("Success: Contract Data Loaded")
        return {
            address: contractAddressData.data.address,
            abi: contractAbis.data
        }

    } catch (err){
        console.log("Error")
        console.log(err)
    }
    

}

module.exports = {
    fetchContractData: fetchContractData
  }