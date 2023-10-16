import { networkConfigInfo } from './global'

export const networkConfig: networkConfigInfo = {
    hardhat: {
        keyHash: '0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c',
        subscriptionId: '4673',
        callbackGasLimit: '500000',
        mintFee: '10000000000000000',
        interval: 30,
        blockConfirmations: 1,
    },
    sepolia: {
        vrfCoordinatorV2: '0x8103b0a8a00be2ddc778e6e7eaa21791cd364625',
        keyHash: '0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c',
        subscriptionId: '4673',
        callbackGasLimit: '500000',
        mintFee: '10000000000000000',
        interval: 30,
        blockConfirmations: 5,
        contractAddress: '0x7581803f45e8ae263d90cd13b6e97b53a97cda67',
        ethUSDPriceFeed: '0x694AA1769357215DE4FAC081bf1f309aDC325306',
    },
}

export const devChains = ['hardhat', 'localhost']
