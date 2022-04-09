const axios = require('axios');
const CsvReader = require('promised-csv');


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


function readCSV(inputFile) {
    return new Promise((resolve, reject) => {

        var reader = new CsvReader();
        var output = [];

        reader.on('row', data => {
            // data is an array of data. You should
            // concatenate it to the data set to compile it.
            output = output.concat(data);
        });

        reader.on('done', () => {
            // output will be the compiled data set.
            resolve(output);
        });

        reader.on('error', err => reject(err));

        reader.read(inputFile);

    });
}

async function mint(contractData){
    console.log("")
    console.log("Minting")
    try {

        const provider = new ethers.providers.JsonRpcProvider(process.env.PROVIDER_URL)
        const signer = new ethers.Wallet(PRIVATEKEY, provider)
        const nftContract = new ethers.Contract(contractData.address, contractData.abi.abi, signer);
        const lotteryAddresses = await readCSV("./static/addresses.csv")
        
        for(let i = 0; i<lotteryAddresses.length; i++){
            // const mintToken = await nftContract.mintForAddress(1, { value: ethers.utils.parseEther(".0001")});
            const mintToken = await nftContract.mintForAddress(1, lotteryAddresses[i]);
            console.log(`Minted for address: ${lotteryAddresses[i]}`)
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