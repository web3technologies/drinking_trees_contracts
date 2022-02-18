// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

contract DrinkingTreesBank {
    

    address payable withdrawAddress;
    address payable owner;

    event Received(address, uint);


    constructor(address _withdrawAddress) {
        owner = payable(msg.sender);
        withdrawAddress = payable(_withdrawAddress);
    }

    // maybe allow for params to only withdraw a certain percentage
    function withdraw() public payable {
      address payable receiver = withdrawAddress;
      require(receiver.send(address(this).balance));
    }

    function setWithdrawAddress(address _withdrawAddress) public  {
        require(msg.sender == owner);
        withdrawAddress = payable(_withdrawAddress);
    }

    receive() external payable {
        emit Received(msg.sender, msg.value);
    }


}