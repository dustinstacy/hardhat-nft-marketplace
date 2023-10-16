import { Deployment, DeploymentsExtension } from 'hardhat-deploy/dist/types'
import { Network } from 'hardhat/types'

export interface DeployInterface {
    getNamedAccounts: () => Promise<{
        [name: string]: string
    }>
    deployments: DeploymentsExtension
    network: Network
}

interface networkConfigItem {
    vrfCoordinatorV2?: string
    entranceFee?: bigint
    keyHash?: string
    subscriptionId?: string
    callbackGasLimit?: string
    interval?: number
    blockConfirmations?: number
    contractAddress?: string
    mintFee?: string
    ethUSDPriceFeed?: string
}

export interface networkConfigInfo {
    [key: string]: networkConfigItem
}
