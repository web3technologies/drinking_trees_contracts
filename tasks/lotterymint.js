const csv = require("./utils/readCSV.js");
const fetchContracts = require("./utils/fetchcontractdata");

// This task will be used to mint all of the first 250 NFTs to a users address


const PRIVATEKEY = process.env.ACCOUNT1_PRIVATEKEY


async function mint(contractData){
    console.log("")
    console.log("Minting")
    try {

        const provider = new ethers.providers.JsonRpcProvider(process.env.PROVIDER_URL)
        const signer = new ethers.Wallet(PRIVATEKEY, provider)
        const nftContract = new ethers.Contract(contractData.address, contractData.abi.abi, signer);
        const lotteryAddresses = await csv.readCSV("./static/addresses.csv")
        
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

// main function
async function lotteryMint(){
    const contractData = await fetchContracts.fetchContractData()
    await mint(contractData)
};


module.exports = {
    lotteryMint: lotteryMint
  }