var ethers = require('ethers');  
var crypto = require('crypto');
const fs = require("fs");


let mintedCount = 1;
const addresses = []
while (mintedCount < 251){
    var id = crypto.randomBytes(32).toString('hex');
    var privateKey = "0x"+id;

    var wallet = new ethers.Wallet(privateKey);

    console.log("Address: " + wallet.address);
    addresses.push(wallet.address)
    mintedCount ++;   
}

const csv = addresses.map((e) => {
    return e.replace(/;/g, ",");
});


fs.writeFile("./static/addresses.csv", csv.join("\r\n"), (err) => {
    console.log(err || "done");
});
