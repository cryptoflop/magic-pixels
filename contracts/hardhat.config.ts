import type { HardhatUserConfig } from 'hardhat/config'
import '@nomicfoundation/hardhat-toolbox'

import '@openzeppelin/hardhat-upgrades';

require('dotenv').config()

const config: HardhatUserConfig = {
  networks: {
    hardhat: {
      chainId: 1
    },
		tenderly: {
      url: process.env['RPC_TENDERLY'],
      accounts: [process.env['TESTI_PK']!]
    },
		base: {
			url: process.env['RPC_BASE'],
		}
  },
  solidity: {
    version: '0.8.22',
    settings: {
      optimizer: {
        enabled: true,
        runs: 1337
      }
    }
  }
}

export default config
