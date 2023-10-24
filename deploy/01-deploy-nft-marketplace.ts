import { DeployFunction } from 'hardhat-deploy/dist/types'
import { devChains, networkConfig } from '../helper-hardhat-config'
import { network } from 'hardhat'
import verify from '../utils/verify'

const deployNFTMarketplace: DeployFunction = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    log('----------------------------')
    log('Deploying NFT Marketplace...')
    const args: any[] = []
    const nftMarketplace = await deploy('NFTMarketplace', {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: networkConfig[network.name].blockConfirmations,
    })

    if (!devChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log('Verifying...')
        await verify(nftMarketplace.address, args)
    }
    log('----------------------------')
}

export default deployNFTMarketplace
deployNFTMarketplace.tags = ['all', 'marketplace']
