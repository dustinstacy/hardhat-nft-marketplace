import { deployments, ethers } from 'hardhat'
import { Address } from 'hardhat-deploy/dist/types'
import { BasicNFT, NFTMarketplace } from '../typechain-types'

const PRICE = ethers.parseEther('1')

const mintAndList = async () => {
    await deployments.fixture(['all'])
    const nftMarketplaceAddress: Address = (await deployments.get('NFTMarketplace')).address
    const nftMarketplace: NFTMarketplace = await ethers.getContractAt(
        'NFTMarketplace',
        nftMarketplaceAddress
    )
    const basicNFTAddress: Address = (await deployments.get('BasicNFT')).address
    const basicNFT: BasicNFT = await ethers.getContractAt('BasicNFT', basicNFTAddress)

    console.log('Minting...')
    const mintTx = await basicNFT.mintNFT()
    const mintTxReceipt = await mintTx.wait(1)
    const tokenID = mintTxReceipt!.logs[0].topics[1]

    console.log('Approving NFT...')
    const approvalTx = await basicNFT.approve(nftMarketplaceAddress, tokenID)
    await approvalTx.wait(1)

    console.log('Listing NFT')
    const listingTX = await nftMarketplace.listItem(basicNFTAddress, tokenID, PRICE)
    await listingTX.wait(1)
    console.log('Listed!')
}

mintAndList().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
