// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import 'erc721a/contracts/ERC721A.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/utils/cryptography/MerkleProof.sol';
import '@openzeppelin/contracts/security/ReentrancyGuard.sol';
import "hardhat/console.sol";


contract DrinkingTrees is ERC721A, Ownable, ReentrancyGuard {

  using Strings for uint256;

    bytes32 public merkleRoot;
    mapping(address => bool) public whitelistClaimed;
    mapping(address => bool) public adminUsers;
    address[] public adminsArr;


    string public baseURI;
    string public baseExtension = ".json";
    string public hiddenMetadataUri;
  
    uint256 public cost = .0001 ether;
    uint256 public maxSupply= 10000;
    uint256 public maxMintAmountPerTx;
    uint256 public adminCount;

    bool public paused = true;
    bool public whitelistMintEnabled = false;
    bool public revealed = false;



    constructor(
        string  memory _tokenName,
        string  memory _tokenSymbol,
        uint256  _maxMintAmountPerTx,
        string  memory _hiddenMetadataUri
    ) ERC721A(_tokenName, _tokenSymbol) {
        setMaxMintAmountPerTx(_maxMintAmountPerTx);
        setHiddenMetadataUri(_hiddenMetadataUri);
    }

    modifier mintCompliance(uint256 _mintAmount) {
        require(_mintAmount > 0 && _mintAmount <= maxMintAmountPerTx, 'Invalid mint amount!');
        require(totalSupply() + _mintAmount <= maxSupply, 'Max supply exceeded!');
        _;
    }

    modifier mintPriceCompliance(uint256 _mintAmount) {
        require(msg.value >= cost * _mintAmount, 'Insufficient funds!');
        _;
    }

    modifier onlyAdmin(address _address){
        require(adminUsers[_address], "You must be an admin user to call this function");
        _;
    }

    function whitelistMint(uint256 _mintAmount, bytes32[] calldata _merkleProof) public payable mintCompliance(_mintAmount) mintPriceCompliance(_mintAmount) {
        // Verify whitelist requirements
        require(whitelistMintEnabled, 'The whitelist sale is not enabled!');
        require(!whitelistClaimed[_msgSender()], 'Address already claimed!');
        bytes32 leaf = keccak256(abi.encodePacked(_msgSender()));
        require(MerkleProof.verify(_merkleProof, merkleRoot, leaf), 'Invalid proof!');

        whitelistClaimed[_msgSender()] = true;
        _safeMint(_msgSender(), _mintAmount);
    }

    function mint(uint256 _mintAmount) public payable mintCompliance(_mintAmount) mintPriceCompliance(_mintAmount) {
        require(!paused, 'The contract is paused!');
        _safeMint(_msgSender(), _mintAmount);
    }
    
    function mintForAddress(uint256 _mintAmount, address _receiver) public mintCompliance(_mintAmount) onlyOwner {
        _safeMint(_receiver, _mintAmount);
    }

    function walletOfOwner(address _owner) public view returns (uint256[] memory) {
        uint256 ownerTokenCount = balanceOf(_owner);
        uint256[] memory ownedTokenIds = new uint256[](ownerTokenCount);
        uint256 currentTokenId = _startTokenId();
        uint256 ownedTokenIndex = 0;
        address latestOwnerAddress;

        while (ownedTokenIndex < ownerTokenCount && currentTokenId <= maxSupply) {
        TokenOwnership memory ownership = _ownerships[currentTokenId];

        if (!ownership.burned && ownership.addr != address(0)) {
            latestOwnerAddress = ownership.addr;
        }

        if (latestOwnerAddress == _owner) {
            ownedTokenIds[ownedTokenIndex] = currentTokenId;

            ownedTokenIndex++;
        }

        currentTokenId++;
        }

        return ownedTokenIds;
    }

    function _startTokenId() internal view virtual override returns (uint256) {
        return 1;
    }

    function tokenURI(uint256 _tokenId) public view virtual override returns (string memory) {
        require(_exists(_tokenId), 'ERC721Metadata: URI query for nonexistent token');

        if (revealed == false) {
            return hiddenMetadataUri;
        }

        return bytes(baseURI).length > 0
            ? string(abi.encodePacked(baseURI, _tokenId.toString(), baseExtension))
            : '';
    }

    function setRevealed(bool _state) public onlyOwner {
        revealed = _state;
    }

    function setCost(uint256 _cost) public onlyOwner {
        cost = _cost;
    }

    function setMaxMintAmountPerTx(uint256 _maxMintAmountPerTx) public onlyOwner {
        maxMintAmountPerTx = _maxMintAmountPerTx;
    }

    function setHiddenMetadataUri(string memory _hiddenMetadataUri) public onlyOwner {
        hiddenMetadataUri = _hiddenMetadataUri;
    }

    function setBaseURI(string memory _newBaseURI) public onlyOwner {
      baseURI = _newBaseURI;
    }

    function setBaseExtension(string memory _newBaseExtension) public onlyOwner {
      baseExtension = _newBaseExtension;
    }

    function setPaused(bool _state) public onlyOwner {
        paused = _state;
    }

    function setMerkleRoot(bytes32 _merkleRoot) public onlyOwner {
        merkleRoot = _merkleRoot;
    }

    function setWhitelistMintEnabled(bool _state) public onlyOwner {
        whitelistMintEnabled = _state;
    }

    function setAdmin(address _address) public onlyOwner {
        adminUsers[_address] = true;
        adminCount ++;
        adminsArr.push(_address);
    }

    function removeAdmin(address _address) public onlyOwner {
        adminUsers[_address] = false;
    }

    function getAdmins() public view returns(address[] memory){

        address[] memory admins = new address[](adminCount);
        
        for (uint i = 0; i < adminCount; i++){
            
            address admin = adminsArr[i];
            if(adminUsers[admin]){
                console.log(admin);
                admins[i] = admin;
            }
        }

        return admins;

    }

    function withdraw() public onlyOwner nonReentrant {
        (bool os, ) = payable(owner()).call{value: address(this).balance}('');
        require(os);
    }

}
