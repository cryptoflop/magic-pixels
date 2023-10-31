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
		tenderly: {
      url: process.env['RPC_TENDERLY'],
      accounts: [process.env['TENDERLY_PK']!, "ed5503c89d022a64b2ebee67ab0447159e5e2354d6fd902fe00ddf497602f414"],
			chainId: 8453
    },
		base: {
			url: process.env['RPC_BASE'],
			chainId: 8453
		},
		mantest: {
			url: process.env['RPC_MANTLE_TEST'],
      accounts: [process.env['MANTLE_PK1']!, process.env['MANTLE_PK2']!],
			chainId: 5001
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
