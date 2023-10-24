import { Address } from 'hardhat-deploy/dist/types'
import { BasicNFT, NFTMarketplace } from '../typechain-types'
import { SignerWithAddress } from '@nomicfoundation/hardhat-ethers/signers'
import { deployments, ethers } from 'hardhat'

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
        nftMarketplace = nftMarketplaceContract.connect(user)
        await basicNFT.mintNFT()
        await basicNFT.approve(nftMarketplaceAddress, TOKEN_ID)
    })
    describe('listItem', async () => {})
    describe('buyItem', async () => {})
    describe('cancelListing', async () => {})
    describe('updateListing', async () => {})
    describe('withdrawProceeds', async () => {})
})
