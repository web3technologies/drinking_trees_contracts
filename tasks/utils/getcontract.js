const fetchContracts = require("./fetchcontractdata");


const PRIVATEKEY = process.env.ACCOUNT1_PRIVATEKEY


// function to get a signer instance of the contract
async function getContract(){

    const contractData = await fetchContracts.fetchContractData()
    const provider = new ethers.providers.JsonRpcProvider(process.env.PROVIDER_URL)
    const signer = new ethers.Wallet(PRIVATEKEY, provider)
    const nftContract = new ethers.Contract(contractData.address, contractData.abi.abi, signer);
    return nftContract
}


module.exports = {
    getContract: getContract
  }