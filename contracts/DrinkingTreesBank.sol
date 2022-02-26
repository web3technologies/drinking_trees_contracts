// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

contract DrinkingTreesBank {
    
    address payable owner;
    uint shareHolderCount = 0;
    string[] private usernames;

    struct ShareHolder {
        uint id;
        string username;
        address wallet;
        uint128 equityPercent;  // technically equity doesnt exist because this number is actually the revenue percent
    }

    mapping(string => ShareHolder) private shareHolders; 

    event Received(address, uint);


    constructor(
        address _miriamAddress,
        address _danAddress,
        address _zachCookAddress,
        address _raymondAddress,
        address _zachComAddress,
        address _charityAddress
        ) {

        owner = payable(msg.sender);
        shareHolderCount ++;
        shareHolders["miriam"] = ShareHolder(shareHolderCount, "miriam", _miriamAddress, 2100);
        usernames.push("miriam");
        shareHolderCount ++;
        shareHolders["dan"] = ShareHolder(shareHolderCount, "dan", _danAddress, 2100);
        usernames.push("dan");
        shareHolderCount ++;
        shareHolders["zachcook"] = ShareHolder(shareHolderCount, "zachcook", _zachCookAddress, 2100);
        usernames.push("zachcook");
        shareHolderCount ++;
        shareHolders["raymond"] = ShareHolder(shareHolderCount, "raymond", _raymondAddress, 2100);
        usernames.push("raymond");
        shareHolderCount ++;
        shareHolders["zachcom"] = ShareHolder(shareHolderCount, "zachcom", _zachComAddress, 600);
        usernames.push("zachcom");
        shareHolderCount ++;
        shareHolders["charity"] = ShareHolder(shareHolderCount, "charity", _charityAddress, 1000);
        usernames.push("charity");
        shareHolderCount ++;

    }

    // allows contract to receive payments
    receive() external payable {
        emit Received(msg.sender, msg.value);
    }

    function withdraw() public payable {

        uint256 currentBalance = address(this).balance;
        console.log("current balance of bank: ", address(this).balance);
        for (uint8 i=0; i<usernames.length; i++){
            string memory username = usernames[i];
            address payable shareHolderWallet = payable(shareHolders[username].wallet);
            uint128 shareholderEquity = shareHolders[username].equityPercent;
            require(shareHolderWallet.send(currentBalance * shareholderEquity / 10000));
        }
        console.log("new balance of bank: ", address(this).balance);
        


    }

    // function setWithdrawAddress(address _withdrawAddress) public  {
    //     require(msg.sender == owner);
    //     withdrawAddress = payable(_withdrawAddress);
    // }

    // function changeUserAddress(string _username, address _newAddress) public {
        
    //     bool memory isUserOwner = shareHolders[_username].wallet == msg.sender;  

    //     require(isUserOwner || signerCount === 3);

    //     signerCount == 0;
    // }

    // function sign(){}        function to allow person to sign
    // function unSign(){}      functoin to allow person to unsign
    


    function getAllShareHolders() public view returns (ShareHolder[] memory) {

      ShareHolder[] memory allShareHolders = new ShareHolder[](usernames.length);
        for (uint8 i=0; i<usernames.length; i++){
            string memory username = usernames[i];
            ShareHolder storage shareHolder = shareHolders[username];
            allShareHolders[i] = shareHolder;
        }
      return allShareHolders;
    }

}