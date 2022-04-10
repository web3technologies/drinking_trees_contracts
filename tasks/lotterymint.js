const csv = require("./utils/readCSV.js");
const getContract = require("./utils/getcontract");


// This task will be used to mint all of the first 250 NFTs to a users address
// calls the contracts mintForAddress method itteratively
async function mint(){
    console.log("")
    console.log("Minting")
    try {
        const nftContract = await getContract.getContract()
        const lotteryAddresses = await csv.readCSV("./static/lotteryaddresses.csv")
        
        for(let i = 0; i<lotteryAddresses.length; i++){
            // const mintToken = await nftContract.mintForAddress(1, { value: ethers.utils.parseEther(".0001")});
            const mintToken = await nftContract.mintForAddress(1, lotteryAddresses[i]);
            // console.log(`Minted for address: ${lotteryAddresses[i]}`)
        }

        console.log("Successful Mint")
        
    } catch(e){
        console.log(e)
        console.log("error")
    }

}

// main function
async function lotteryMint(){
    await mint()
};


module.exports = {
    lotteryMint: lotteryMint
  }