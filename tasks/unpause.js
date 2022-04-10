
const getContract = require("./utils/getcontract");


async function unPause(){

    const nftContract = await getContract.getContract()
    try {
        await nftContract.setPaused(false);
    } catch (e){
        console.log(e)
    }

}



module.exports = {
    unPause: unPause
  }