import { defineConfig } from '@wagmi/cli'
import { hardhat } from '@wagmi/cli/plugins'

export default defineConfig({
  out: './generated.ts',

  plugins: [
    hardhat({
      project: '.',
      include: [
        'NGUFCrowdsale.json',
        'NeverGibUpFrenV1.json'
      ],
      deployments: {
        NGUFCrowdsale: {
          1: '0xc981ec845488b8479539e6B22dc808Fb824dB00a'
        },
        NeverGibUpFrenV1: {
          1: '0x5207CA53386E1b462316EC9726B9e150de82Bc14'
        },
      },
    })
  ]
})
