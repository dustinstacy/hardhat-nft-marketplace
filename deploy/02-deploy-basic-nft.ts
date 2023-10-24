import { network } from 'hardhat'
import { devChains, networkConfig } from '../helper-hardhat-config'
import { DeployFunction } from 'hardhat-deploy/dist/types'
import verify from '../utils/verify'

const deployBasicNFT: DeployFunction = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    log('-------------------------')
    const args: any[] = []
    const basicNFT = await deploy('BasicNFT', {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: networkConfig[network.name].blockConfirmations,
    })

    if (!devChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log('Verifying...')
        await verify(basicNFT.address, args)
    }
    log('-------------------------')
}

export default deployBasicNFT
deployBasicNFT.tags = ['all', 'basic']
