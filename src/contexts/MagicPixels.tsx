import { createContext, createEffect, createSignal, JSX, useContext } from 'solid-js'
import { Web3Context } from './Web3'

import { BigNumber, ethers } from 'ethers'
import MagicPixelsArtifact from '../../Contracts/artifacts/contracts/MagicPixels.sol/MagicPixels.json'

export const MagicPixelsContext = createContext<ReturnType<typeof makeMagicPixelsContext>>()

function makeMagicPixelsContext() {
  const [pixelCount, setPixelCount] = createSignal<number>(0)
  const [pixels, setPixels] = createSignal<number[]>(Array(220).fill(0))

  const web3Context = useContext(Web3Context)

  const actions = {
    updatePixels: async (address?: string) => {
      const magicPixels = new ethers.Contract(
        '0x5FbDB2315678afecb367f032d93F642f64180aa3',
        MagicPixelsArtifact.abi,
        web3Context!.provider
      )

      try {
        const pixelsResult: BigNumber[] = await magicPixels.getAllPixels(web3Context!.state.address!)
        if (pixelsResult && pixelsResult[0]) {
          const pixels = pixelsResult.map(bn => bn.toNumber())
          setPixels(pixels)
          setPixelCount(pixels.reduce((p, c) => p + c, 0))
        }
        console.log(pixels())
      } catch(err) {
        void 0
      }
    }
  }

  createEffect(() => {
    actions.updatePixels(web3Context!.state.address!)
  })

  return { actions, pixels, pixelCount }
}

export function MagicPixelsProvider(props: { children: JSX.Element }) {
  const context = makeMagicPixelsContext()

  return <MagicPixelsContext.Provider value={context}>
    {props.children}
  </MagicPixelsContext.Provider>
}