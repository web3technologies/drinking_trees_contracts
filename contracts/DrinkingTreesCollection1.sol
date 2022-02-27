// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";


contract DrinkingTrees is ERC721Enumerable, Ownable {
    using Strings for uint256;

    string public baseURI;
    string public baseExtension = ".json";
    uint256 public cost = 0.02 ether; //represents .002 eth
    uint256 public maxSupply = 1000;
    bool public paused = false;
    address marketAddress;
    address payable bankAddress;

    mapping(address => bool) public whitelisted;

    constructor (string memory _name, string memory _symbol, string memory _initBaseURI, address _marketAddress, address _bankAddress) ERC721(_name, _symbol) {
        setBaseURI(_initBaseURI);
        marketAddress = _marketAddress;
        bankAddress = payable(_bankAddress);
    }

    // internal
      function _baseURI() internal view virtual override returns (string memory) {
        return baseURI;
      }

    // public
    function mint() public payable {
        uint256 supply = totalSupply();
        require(!paused);
        require(supply + 1 <= maxSupply);
        if (msg.sender != owner()) {
            if(whitelisted[msg.sender] != true) {
              require(msg.value >= cost);
            }
        }

        _safeMint(msg.sender, supply + 1);
        setApprovalForAll(marketAddress, true);
        withdraw();
    }

    function walletOfOwner(address _owner)
      public
      view
      returns (uint256[] memory)
    {
      uint256 ownerTokenCount = balanceOf(_owner);
      uint256[] memory tokenIds = new uint256[](ownerTokenCount);
      for (uint256 i; i < ownerTokenCount; i++) {
        tokenIds[i] = tokenOfOwnerByIndex(_owner, i);
      }
      return tokenIds;
    }

    function tokenURI(uint256 tokenId)
      public
      view
      virtual
      override
      returns (string memory)
    {
      require(
        _exists(tokenId),
        "ERC721Metadata: URI query for nonexistent token"
      );

      string memory currentBaseURI = _baseURI();
      return bytes(currentBaseURI).length > 0
          ? string(abi.encodePacked(currentBaseURI, tokenId.toString(), baseExtension))
          : "";
    }

    //only owner
    function setCost(uint256 _newCost) public onlyOwner {
      cost = _newCost;
    }

    function setBaseURI(string memory _newBaseURI) public onlyOwner {
      baseURI = _newBaseURI;
    }

    function setBaseExtension(string memory _newBaseExtension) public onlyOwner {
      baseExtension = _newBaseExtension;
    }

    function pause(bool _state) public onlyOwner {
      paused = _state;
    }
  
    function whitelistUser(address _user) public onlyOwner {
      whitelisted[_user] = true;
    }
  
    function removeWhitelistUser(address _user) public onlyOwner {
      whitelisted[_user] = false;
    }

    // function updateBankAddress()

    function withdraw() public payable {
      address payable receiver = bankAddress;
      require(receiver.send(address(this).balance));
    }
  }