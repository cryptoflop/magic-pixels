import { createContext, createEffect, createSignal, JSX, useContext } from 'solid-js'
import { Web3Context } from './Web3'

import { BigNumber, ethers } from 'ethers'
import MagicPixelsArtifact from '../../Contracts/artifacts/contracts/MagicPixels.sol/MagicPixels.json'
import { rndBtwn } from '../helpers/utils'

export const MagicPixelsContext = createContext<ReturnType<typeof makeMagicPixelsContext>>()

const MAGIG_PIXELS_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3'

function makeMagicPixelsContext() {
  const [pixelCount, setPixelCount] = createSignal<number>(0)
  const [pixels, setPixelsArr] = createSignal<number[]>(Array(220).fill(0))
  const [pixelsMap, setPixelsMap] = createSignal<{ [key: number]: number }>({})
  const conjuringHistory: number[][] = []

  const web3Context = useContext(Web3Context)

  const mpContract = new ethers.Contract(
    MAGIG_PIXELS_ADDRESS,
    MagicPixelsArtifact.abi,
    web3Context!.provider.getSigner()
  )

  const setPixels = (pixels: number[]) => {
    setPixelsArr(pixels)
    setPixelsMap(Object.fromEntries(pixels.map((amount, i) => [i, amount])))
    setPixelCount(pixels.reduce((p, c) => p + c, 0))
    console.log('Pixels updated')
  }

  const actions = {
    updatePixels: async () => {
      try {
        const pixelsResult: BigNumber[] = await mpContract.getAllPixels(web3Context!.state.address!)
        if (pixelsResult && pixelsResult[0]) {
          const pixels = pixelsResult.map(bn => bn.toNumber())
          setPixels(pixels)
        }
      } catch(err) {
        void 0
      }
    },
    conjurePixels: async () => {
      await mpContract.mintPixels(web3Context!.state.address!, Array(8).fill(1).map(() => rndBtwn(0, 220)))
    },
    mergePixels: (pixelsToMerge: number[]) => {
      const p = [...pixels()]
      for (const idx of pixelsToMerge) {
        p[idx]++
      }
      setPixels(p)
    }
  }

  createEffect(() => {
    web3Context!.state.address! // this is here for making this effect observe the address
    actions.updatePixels()
  })

  mpContract.on('PixelsConjured(address,uint8[8])', (_, rnds: number[]) => {
    conjuringHistory.push(rnds)
    if (conjuringHistory.length > 1) {
      actions.mergePixels(rnds)
    }
  })

  return { actions, pixels, pixelsMap, pixelCount }
}

export function MagicPixelsProvider(props: { children: JSX.Element }) {
  const context = makeMagicPixelsContext()

  return <MagicPixelsContext.Provider value={context}>
    {props.children}
  </MagicPixelsContext.Provider>
}