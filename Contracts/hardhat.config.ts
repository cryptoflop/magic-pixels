import type { HardhatUserConfig } from 'hardhat/config'
import '@nomicfoundation/hardhat-toolbox'

import '@openzeppelin/hardhat-upgrades';

const config: HardhatUserConfig = {
  networks: {
    hardhat: {
      chainId: 1
    }
  },
  solidity: {
    version: '0.8.18',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
}

export default config
