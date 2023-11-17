import type { HardhatUserConfig } from 'hardhat/config'
import '@nomicfoundation/hardhat-toolbox'
import "@nomicfoundation/hardhat-viem";

import '@openzeppelin/hardhat-upgrades';

require('dotenv').config()

const config: HardhatUserConfig = {
  networks: {
    hardhat: {
      chainId: 8453
    },
		poly: {
			url: process.env['RPC_POLY'],
			accounts: [process.env['PK1']!, process.env['PK2']!],
			chainId: 137
		},
		arb: {
      url: process.env['RPC_ARB'],
			accounts: [process.env['PK1']!, process.env['PK2']!],
			chainId: 42161
    },
		basetest: {
      url: process.env['RPC_BASETEST'],
			accounts: [process.env['PK1']!, process.env['PK2']!],
			chainId: 84531
    },
		base: {
			url: process.env['RPC_BASE'],
			accounts: [process.env['PK1']!, process.env['PK2']!],
			chainId: 8453
		},
		mantest: {
			url: process.env['RPC_MANTLE_TEST'],
      accounts: [process.env['PK1']!, process.env['PK2']!],
			chainId: 5001
		}
  },

	etherscan: {
    apiKey: {
      arbitrumOne: process.env['ETHERSCAN_ARB']!
    }
  },

  solidity: {
    version: '0.8.18',
    settings: {
      optimizer: {
        enabled: true,
        runs: 1337
      }
    }
  }
}

export default config
