const csv = require("./utils/readCSV.js");
const getContract = require("./utils/getcontract");


async function setAdminUsers(){

    const admins = await csv.readCSV("./static/adminaddresses.csv")
    const nftContract = await getContract.getContract()

    for (let i =0; i<admins.length; i++){

        try {
            await nftContract.setAdmin(admins[i])
            console.log(`Admin set at: ${admins[i]}`)
        } catch (e){
            console.log(e)
        }
        
    }

    try {
        const adminUsersFromContract = await nftContract.getAdmins();
        console.log(adminUsersFromContract)
    } catch(e){
        console.log(e)
        console.log("err")
    }
    
}



module.exports = {
    setAdminUsers: setAdminUsers
  }