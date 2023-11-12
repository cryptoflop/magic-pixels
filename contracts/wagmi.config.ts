import { defineConfig } from '@wagmi/cli'
import { hardhat } from '@wagmi/cli/plugins'

export default defineConfig({
  out: './generated.ts',

  plugins: [
    hardhat({
      project: '.',
      include: [
				'PxlsCommon.json',
				'PxlsNether.json',
				'PxlsCore.json',

				'TrdsCore.json',

        'MagicPlates.json'
      ]
      // deployments: {
      //   PXLS: {
      //     1: '0x123'
      //   },
      //   PLTS: {
      //     1: '0x321'
      //   },
      // }
    })
  ]
})
