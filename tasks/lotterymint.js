const fetch = require('node-fetch');



async function fetchContractData() {

    const urlBase = `${process.env.S3_BUCKET_URL}/${process.env.CONTRACT_ENV}`

    const contractAddressData = await fetch(`${urlBase}/contracts/address/DrinkingTrees.json`);
    const contractAbis = await fetch(`${urlBase}/contracts/DrinkingTrees.sol/DrinkingTrees.json`);

    try {
      return {
          address: contractAddressData,
          abi: contractAbis
      }
    } catch (err) {
      console.error('Error - ', err);
    }
  }

async function lotteryMint(){

    console.log('Fetching Contracts')
    const contractData = await fetchContractData()
    console.log(contractData.address)
};


module.exports = {
    lotteryMint: lotteryMint
  }