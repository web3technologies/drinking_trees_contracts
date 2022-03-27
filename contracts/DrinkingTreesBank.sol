// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";


contract DrinkingTreesBank {
    
    event Received(address indexed sender, uint amount);



    address payable owner;
    uint public shareHolderCount = 0;
    string[] private usernames;

    uint equityPercentAllowed = 10000; // represents 100%
    uint public equityPercentAllocated = 0;
    uint private withdrawAddressSignatures; 

    struct ShareHolder {
        uint id;
        string username;
        address wallet;
        uint128 equityPercent;  // technically equity doesnt exist because this number is actually the revenue percent
        uint changeCount;
    }

    mapping(string => ShareHolder) public shareHolders; 

    modifier RequireShareHolder(string _username){
        ShareHolder memory shareHolder = shareHolders[_username];
        require(msg.sender == shareHolder.wallet, "not an authorized shareholder");
        _;
    }


    constructor(
        address calldata _miriamAddress,
        address calldata _danAddress,
        address calldata _zachCookAddress,
        address calldata _raymondAddress,
        address calldata _zachComAddress,
        address calldata _charityAddress,
        address calldata _vaultAddress
        ) {

        owner = payable(msg.sender);

        _createShareHolder("VelveteenCryptoGirl", _miriamAddress, 1860);
        _createShareHolder("dannyboy", _danAddress, 1860);
        _createShareHolder("buy_it_all", _zachCookAddress, 1860);
        _createShareHolder("doctorculture", _raymondAddress, 1860);
        _createShareHolder("ZAch", _zachComAddress, 560);
        _createShareHolder("charity", _charityAddress, 1000);
        _createShareHolder("vault", _vaultAddress, 1000);

    }

    // allows contract to receive payments
    receive() external payable {
        emit Received(msg.sender, msg.value);
    }

    function _createShareHolder(string memory _username, address _walletAddress, uint128 _equityPercentage) private {
        
        require(equityPercentAllocated + _equityPercentage <= equityPercentAllowed, "Given equity percentage must not be larger than 10000");
        shareHolders[_username] = ShareHolder(shareHolderCount, _username, _walletAddress, _equityPercentage, 0);
        usernames.push(_username);
        shareHolderCount ++;
        equityPercentAllocated += _equityPercentage;
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

    function getAdminUser() public view returns (bool){

        if (msg.sender == owner){return true;}
        for (uint8 i=0; i<usernames.length; i++){
            string memory username = usernames[i];
            ShareHolder storage shareHolder = shareHolders[username];
            if(msg.sender == shareHolder.wallet){
                return true;
            }
        }

        return false;
    }

    function withdraw() public payable { // IMPORTANT NEED TO PREVENT REENTRANCY

        // need to require shareholder only call this

        uint256 currentBalance = address(this).balance;
        for (uint8 i=0; i<usernames.length; i++){
            string memory username = usernames[i];
            address payable shareHolderWallet = payable(shareHolders[username].wallet);
            uint128 shareholderEquity = shareHolders[username].equityPercent;
            require(shareHolderWallet.send(currentBalance * shareholderEquity / 10000));
        }
        
    }

    // function approveUserChange(){}
    // function revokeUserChange(){}

    function changeUserAddress(string memory _username, address _newAddress) public {
        
        ShareHolder storage shareHolder = shareHolders[_username];
        require(shareHolder.wallet == msg.sender || shareHolder.changeCount >= 4, "You must be user of this account or 4 user change votes must be signed");
        shareHolder.wallet = _newAddress;
        shareHolder.changeCount = 0;
    }

    // function pauseWithdraw(){}
    

}