// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";


contract DrinkingTreesBank {
    
    address payable owner;
    uint public shareHolderCount = 0;
    string[] private usernames;

    uint private withdrawAddressSignatures; 

    struct ShareHolder {
        uint id;
        string username;
        address wallet;
        uint128 equityPercent;  // technically equity doesnt exist because this number is actually the revenue percent
    }

    mapping(string => ShareHolder) public shareHolders; 

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

        _createShareHolder("miriam", _miriamAddress, 2100);
        _createShareHolder("dan", _danAddress, 2100);
        _createShareHolder("zachcook", _zachCookAddress, 2100);
        _createShareHolder("raymond", _raymondAddress, 2100);
        _createShareHolder("zachcom", _zachComAddress, 600);
        _createShareHolder("charity", _charityAddress, 1000);

    }

    // allows contract to receive payments
    receive() external payable {
        emit Received(msg.sender, msg.value);
    }

    function _createShareHolder(string memory _username, address _walletAddress, uint128 _equityPercentage) private {
        shareHolders[_username] = ShareHolder(shareHolderCount, _username, _walletAddress, _equityPercentage);
        usernames.push(_username);
        shareHolderCount ++;
    }

    function getAllShareHolders() public view returns (ShareHolder[] memory) {
        ShareHolder[] memory allShareHolders = new ShareHolder[](usernames.length);
            for (uint8 i=0; i<usernames.length; i++){
                string memory username = usernames[i];
                ShareHolder storage shareHolder = shareHolders[username];
                allShareHolders[i] = shareHolder;
            }
        return allShareHolders;
    }

    function withdraw() public payable {

        uint256 currentBalance = address(this).balance;
        for (uint8 i=0; i<usernames.length; i++){
            string memory username = usernames[i];
            address payable shareHolderWallet = payable(shareHolders[username].wallet);
            uint128 shareholderEquity = shareHolders[username].equityPercent;
            require(shareHolderWallet.send(currentBalance * shareholderEquity / 10000));
        }
        


    }


    function changeUserAddress(string memory _username, address _newAddress) public {
        
        ShareHolder storage shareHolder = shareHolders[_username];
        require(shareHolder.wallet == msg.sender, "You be user of this account to update address");
        shareHolder.wallet = _newAddress;
        // signerCount == 0;
    }

    // function sign(){}        function to allow person to sign
    // function unSign(){}      functoin to allow person to unsign
    // function getsignatures public view(){}
    


    

}