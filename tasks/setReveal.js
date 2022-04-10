const getContract = require("./utils/getcontract");

const baseURI = process.env.BASE_URI

// function to set the base uri for the nfts and the set reveal to true
async function setReveal(){

    const nftContract = await getContract.getContract()
    try {
        await nftContract.setBaseURI(baseURI);
        await nftContract.setRevealed(true);
    } catch (e){
        console.log(e)
    }

}



module.exports = {
    setReveal: setReveal
  }