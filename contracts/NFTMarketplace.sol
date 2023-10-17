// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

error NFTMarketplace__PriceMustBeAboveZero();
error NFTMarketplace__NotApprovedForMarketplace();

contract NFTMarketplace {
    //////////////////////
    /// Main Functions ///
    //////////////////////

    function listItem(
        address nftAddress,
        uint256 tokenId,
        uint256 price
    ) external {
        if (price <= 0) {
            revert NFTMarketplace__PriceMustBeAboveZero();
        }
        IERC721 nft = IERC721(nftAddress);
        if (nft.getApproved(tokenId) != address(this)) {
            revert NFTMarketplace__NotApprovedForMarketplace();
        }
    }
}

// 1. Create a decentralized NFT Marketplace
//     1. `listItem`: List NFTs on the marketplace
//     2. `butItem`: Buy the NFTs
//     3. `cancelItem`: Cancel a listing
//     4. `updateListing`: Update a price
//     5. `withdrawProceeds`: Withdraw payment for my bought NFTs