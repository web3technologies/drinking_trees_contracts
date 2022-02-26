// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

contract DrinkingTreesBank {
    
    address payable owner;
    address payable public miriamAddress;
    address payable public danAddress;
    address payable public zachCookAddress;
    address payable public raymondAddress;
    address payable public zachComAddress;
    address payable public charityAddress; // we could setup this fund for on chain tracking OR just make our companies donations public
    

    uint128 miriamPercent = 2100;
    uint128 danPercent = 2100;
    uint128 zachCookPercent = 2100;
    uint128 raymondPercent = 2100;
    uint128 charityPercent = 1000;
    uint128 zachComPercent = 600;

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
        miriamAddress = payable(_miriamAddress);
        danAddress = payable(_danAddress);
        zachCookAddress = payable(_zachCookAddress);
        raymondAddress = payable(_raymondAddress);
        zachComAddress = payable(_zachComAddress); 
        charityAddress = payable(_charityAddress);

    }

    // maybe allow for params to only withdraw a certain percentage
    function withdraw() public payable {
        
        address payable miriamWallet = miriamAddress;
        address payable danWallet = danAddress;
        address payable zachCookWallet = zachCookAddress;
        address payable raymondWallet = raymondAddress;
        address payable zachComWallet = zachComAddress;
        address payable charityWallet = charityAddress;

        uint256 currentBalance = address(this).balance;
        console.log("current balance of bank: ", address(this).balance);
        require(miriamWallet.send(currentBalance * miriamPercent / 10000));
        require(danWallet.send(currentBalance * danPercent / 10000));
        require(zachCookWallet.send(currentBalance * zachCookPercent / 10000));
        require(raymondWallet.send(currentBalance * raymondPercent / 10000));
        require(zachComWallet.send(currentBalance * zachComPercent / 10000));
        require(charityWallet.send(currentBalance * charityPercent / 10000));
        console.log("new balance of bank: ", address(this).balance);
    }

    // function setWithdrawAddress(address _withdrawAddress) public  {
    //     require(msg.sender == owner);
    //     withdrawAddress = payable(_withdrawAddress);
    // }

    receive() external payable {
        emit Received(msg.sender, msg.value);
    }


}