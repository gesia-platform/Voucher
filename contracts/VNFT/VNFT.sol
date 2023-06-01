// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "contracts/interface/IERC20.sol";
import "contracts/utils/Ownable.sol";
import "contracts/utils/Counters.sol";
import "contracts/utils/SafeMath.sol";
import "contracts/tokens/ERC721.sol";
import "contracts/tokens/ERC721Enumerable.sol";

contract NfvNFT is ERC721Enumerable, Ownable {
    using Counters for Counters.Counter;
    using SafeMath for uint256;
    Counters.Counter private _tokenIdTracker;

    mapping(uint256 => string) private _tokenURIs;
    mapping(uint256 => uint256) private _tokenWeight;
    address public nvmToken;

    constructor(string memory name, string memory symbol, address _nvmToken) ERC721(name, symbol) {
        nvmToken = _nvmToken;
        _tokenIdTracker.increment();
    }

    function mint(address _to, uint256 _carbonAmount, string memory _metadata) external  {
        require(_carbonAmount > 0, "must be higher than zero");
        require(IERC20(nvmToken).balanceOf(msg.sender) >= _carbonAmount, "lack of carbon balance");
        IERC20(nvmToken).transferFrom(msg.sender, address(this), _carbonAmount);
        super._mint(_to, _tokenIdTracker.current());
        _setTokenURI(_tokenIdTracker.current(), _metadata);
        _tokenWeight[_tokenIdTracker.current()] = _carbonAmount;
        _tokenIdTracker.increment();
    }

    function _setTokenURI(uint256 tokenId, string memory _tokenURI) internal virtual {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");
        _tokenURIs[tokenId] = _tokenURI;
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");
        return _tokenURIs[tokenId];
    }

    function tokenWeight(uint256 tokenId) public view returns (uint256) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");
        return _tokenWeight[tokenId];
    }
}
