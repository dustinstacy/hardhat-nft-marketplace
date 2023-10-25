import { Address } from 'hardhat-deploy/dist/types'
import { BasicNFT, NFTMarketplace } from '../typechain-types'
import { SignerWithAddress } from '@nomicfoundation/hardhat-ethers/signers'
import { deployments, ethers } from 'hardhat'
import { expect } from 'chai'

describe('NFTMarketplace', () => {
    let nftMarketplaceContract: NFTMarketplace
    let nftMarketplaceAddress: Address
    let nftMarketplace: NFTMarketplace
    let basicNFT: BasicNFT
    let basicNFTAddress: Address
    let deployer: SignerWithAddress
    let user: SignerWithAddress

    const PRICE = ethers.parseEther('0.1')
    const TOKEN_ID = 0

    beforeEach(async () => {
        const accounts = await ethers.getSigners()
        deployer = accounts[0]
        user = accounts[1]

        await deployments.fixture(['all'])
        nftMarketplaceAddress = (await deployments.get('NFTMarketplace')).address
        nftMarketplaceContract = await ethers.getContractAt('NFTMarketplace', nftMarketplaceAddress)
        basicNFTAddress = (await deployments.get('BasicNFT')).address
        basicNFT = await ethers.getContractAt('BasicNFT', basicNFTAddress)

        nftMarketplace = nftMarketplaceContract.connect(deployer)
        await basicNFT.mintNFT()
        await basicNFT.approve(nftMarketplaceAddress, TOKEN_ID)
    })

    describe('listItem', async () => {
        it('Reverts if the price is not above zero', async () => {
            await expect(
                nftMarketplace.listItem(basicNFTAddress, TOKEN_ID, 0)
            ).to.be.revertedWithCustomError(nftMarketplace, 'NFTMarketplace__PriceMustBeAboveZero')
        })
        it('Emits an event after listing an item', async () => {
            expect(await nftMarketplace.listItem(basicNFTAddress, TOKEN_ID, PRICE)).to.emit(
                nftMarketplace,
                'ItemListed'
            )
        })
        it('Only lists an item that is not already listed', async () => {
            expect(
                await nftMarketplace.listItem(basicNFTAddress, TOKEN_ID, PRICE)
            ).to.be.revertedWithCustomError(nftMarketplace, 'NFTMarketplace__AlreadyListed')
        })
        it('Only allows the owner to list an item', async () => {
            nftMarketplace = nftMarketplaceContract.connect(user)
            await basicNFT.approve(await user.getAddress(), TOKEN_ID)
            await expect(
                nftMarketplace.listItem(basicNFTAddress, TOKEN_ID, PRICE)
            ).to.be.revertedWithCustomError(nftMarketplace, 'NFTMarketplace__NotOwner')
        })

        it('Requires approval to list an item', async () => {
            await basicNFT.approve(ethers.ZeroAddress, TOKEN_ID)
            await expect(
                nftMarketplace.listItem(basicNFTAddress, TOKEN_ID, PRICE)
            ).to.be.revertedWithCustomError(
                nftMarketplace,
                'NFTMarketplace__NotApprovedForMarketplace'
            )
        })
        it('Updates listing with seller and price', async () => {
            await nftMarketplace.listItem(basicNFTAddress, TOKEN_ID, PRICE)
            const listing = await nftMarketplace.getListing(basicNFTAddress, TOKEN_ID)
            expect(listing.seller).to.equal(await deployer.getAddress())
            expect(listing.price).to.equal(PRICE)
        })
    })

    describe('buyItem', async () => {
        it('Emits an item bought event', async () => {
            await nftMarketplace.listItem(basicNFTAddress, TOKEN_ID, PRICE)
            nftMarketplace = nftMarketplaceContract.connect(user)
            expect(
                await nftMarketplace.buyItem(basicNFTAddress, TOKEN_ID, { value: PRICE })
            ).to.emit(nftMarketplace, 'ItemBought')
        })
        it('Only buys and items if it is listed', async () => {
            await expect(
                nftMarketplace.buyItem(basicNFTAddress, TOKEN_ID)
            ).to.be.revertedWithCustomError(nftMarketplace, 'NFTMarketplace__NotListed')
        })
        it('Only buys the items if enough payment is sent', async () => {
            await nftMarketplace.listItem(basicNFTAddress, TOKEN_ID, PRICE)
            nftMarketplace = nftMarketplace.connect(user)
            await expect(
                nftMarketplace.buyItem(basicNFTAddress, TOKEN_ID)
            ).to.be.revertedWithCustomError(nftMarketplace, 'NFTMarketplace__PriceNotMet')
        })
        it('Increases the sellers proceeds by the payment amout', async () => {
            const previousSellerProceeds = await nftMarketplace.getProceeds(deployer)
            await nftMarketplace.listItem(basicNFTAddress, TOKEN_ID, PRICE)
            nftMarketplace = nftMarketplaceContract.connect(user)
            await nftMarketplace.buyItem(basicNFTAddress, TOKEN_ID, { value: PRICE })
            expect(await nftMarketplace.getProceeds(deployer)).to.equal(
                previousSellerProceeds + PRICE
            )
        })
        it('Removes the items from listings', async () => {
            await nftMarketplace.listItem(basicNFTAddress, TOKEN_ID, PRICE)
            nftMarketplace = nftMarketplaceContract.connect(user)
            await nftMarketplace.buyItem(basicNFTAddress, TOKEN_ID, { value: PRICE })
            expect((await nftMarketplace.getListing(basicNFTAddress, TOKEN_ID)).price).to.equal('0')
        })
        it('Transfers the bought item to the buyer', async () => {
            await nftMarketplace.listItem(basicNFTAddress, TOKEN_ID, PRICE)
            nftMarketplace = nftMarketplaceContract.connect(user)
            await nftMarketplace.buyItem(basicNFTAddress, TOKEN_ID, { value: PRICE })
            expect(await basicNFT.ownerOf(TOKEN_ID)).to.equal(user.address)
        })
    })

    describe('cancelListing', async () => {
        it('Emits an item Canceled event', async () => {})
        it('Only allows the owner to cancel a listing', () => {})
        it('Only cancels a listing that is already listed', () => {})
        it('Removes the items from listings', async () => {})
    })

    describe('updateListing', async () => {
        it('Emits and item updated event', async () => {})
        it('Only allows the owner to update a listing', () => {})
        it('Only updates a listing that is already listed', () => {})
        it('Updates the listed item with the new price', async () => {})
    })

    describe('withdrawProceeds', async () => {
        it('Only withdraws proceeds if the balance is greater than 0', async () => {})
        it('Reduces the withdrawers proceeds to 0', async () => {})
        it('Updates the withdrawers address balance', async () => {})
        it('Reverts the transaction if the transfer fails', async () => {})
    })
})
