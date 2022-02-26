// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "hardhat/console.sol";


contract NFTMarket is ReentrancyGuard {
    
    
    using Counters for Counters.Counter;
    Counters.Counter private _itemIds;
    Counters.Counter private _itemsSold;
    address payable owner;
    address nftAddress;     // will be used to store the address of the nft to be used in sales and market creation
    address payable bankAddress;

    uint buyerPremium = 250;
    uint sellerPremium = 500;

    constructor(address _bankAddress) {
        owner = payable(msg.sender);
        bankAddress = payable(_bankAddress);
    }

    struct MarketItem {
        uint itemId;
        address nftContract;
        uint256 tokenId;
        address payable seller;
        address payable owner;
        uint256 price;
        bool sold;
    }

    mapping(uint256 => MarketItem) private idToMarketItem;

    event MarketItemCreated (
        uint indexed itemId,
        address indexed nftContract,
        uint256 indexed tokenId,
        address seller,
        address owner,
        uint256 price,
        bool sold
    );

    function setNftAddress(address _nftAddress) public {
        require(msg.sender == owner);
        nftAddress = _nftAddress;
    }

    // function updateBankAddress()


    function setSellerPremium(uint256 _sellerPremium) public{
        sellerPremium = _sellerPremium;
    } 

    function createMarketItem(      // this method basically creates a listing ie someones wants to sell their nft
        address nftContract,
        uint256 tokenId,
        uint256 price
    ) public payable nonReentrant {
        
        require(price > 0, "Price must be at least 1 wei");

        _itemIds.increment();
        uint256 itemId = _itemIds.current();

        console.log("Listing Price: ", price);

        idToMarketItem[itemId] = MarketItem(
            itemId,
            nftContract,
            tokenId,
            payable(msg.sender),
            payable(address(0)), // being set to an empty address because this lister has now put it up for sale
            price,
            false
        );

        IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId); // this transfers the nft back to the contract

        emit MarketItemCreated(
            itemId, 
            nftContract, 
            tokenId, 
            msg.sender, 
            owner, 
            price, 
            false
        );

    }

    function createMarketSale(     // a user will call this function when buying the nft from the secondary market
        address nftContract,
        uint256 itemId
    ) public payable nonReentrant {
        
        uint price = idToMarketItem[itemId].price;
        uint tokenId = idToMarketItem[itemId].tokenId;
        console.log("nftId: ", itemId);
        console.log("tokenID: ", tokenId);
        console.log("Price: ", price);
        console.log("msg.value: ", msg.value);

        uint fee = price * sellerPremium / 10000;
        console.log("Fee is: ", fee);
        uint sellerValue = msg.value - fee;
        console.log("Seller value: ", sellerValue);

        require(msg.value == price, "Please submit the asking price in order to complete the purchase");
        idToMarketItem[itemId].seller.transfer(sellerValue); // transfer money from buyer to seller
        IERC721(nftContract).transferFrom(address(this), msg.sender, tokenId); // transfer the nft to the buyer
        idToMarketItem[itemId].owner = payable(msg.sender);
        idToMarketItem[itemId].sold = true;
        _itemsSold.increment();

        payable(bankAddress).transfer(fee); // commission price... Here it is the listing price... however this could be a percentage of the actual sale price...
        // address(this).call{value: listingPrice}
        console.log("transfered");
    }

    // function cancelMarketItem(){}

    


    function fetchMarketItems() public view returns (MarketItem[] memory) {     // gets all the items that are available for sale
        
        uint itemCount = _itemIds.current();
        uint unsoldItemCount = _itemIds.current() - _itemsSold.current();
        uint currentIndex = 0;      // can this be removed and just use i?

        MarketItem[] memory items = new MarketItem[](unsoldItemCount);

        for (uint i = 0; i < itemCount; i++){
            if (idToMarketItem[i + 1].owner == address(0)) {
                uint currentId = idToMarketItem[i + 1].itemId;
                MarketItem storage currentItem = idToMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }

        return items;

    }



}