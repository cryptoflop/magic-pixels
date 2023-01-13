import { createContext, JSX, observable, useContext } from 'solid-js'
import { createStore, produce } from 'solid-js/store'
import { rndBtwn } from '../helpers/utils'

import { BigNumber, ethers } from 'ethers'
import MagicPixelsArtifact from '../../Contracts/artifacts/contracts/MagicPixels.sol/MagicPixels.json'

import { Web3Context } from './Web3'

export const MagicPixelsContext = createContext<ReturnType<typeof makeMagicPixelsContext>>()

const MAGIG_PIXELS_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3'

function makeMagicPixelsContext() {
  const [state, setState] = createStore({
    pixels: Array(220).fill(0),
    count: 0,
    map: {} as { [key: number]: number },
    conjuringHistory: [] as number[][]
  })

  const web3Ctx = useContext(Web3Context)!

  const mpContract = new ethers.Contract(
    MAGIG_PIXELS_ADDRESS,
    MagicPixelsArtifact.abi,
    web3Ctx!.provider.getSigner()
  )

  const setPixels = (pixels: number[]) => {
    setState({
      pixels,
      count: pixels.reduce((p, c) => p + c, 0),
      map: Object.fromEntries(pixels.map((amount, i) => [i, amount]))
    })
    console.log('Pixels updated')
  }

  const actions = {
    updatePixels: async () => {
      const pixelsResult: BigNumber[] = await mpContract.getAllPixels(web3Ctx.state.address!)
      if (pixelsResult && pixelsResult[0]) {
        const pixels = pixelsResult.map(bn => bn.toNumber())
        setPixels(pixels)
      }
    },
    conjurePixels: async () => {
      await mpContract.mintPixels(web3Ctx.state.address!, Array(8).fill(1).map(() => rndBtwn(0, 220)))
    },
    mergePixels: (pixelsToMerge: number[]) => {
      const p = [...state.pixels]
      for (const idx of pixelsToMerge) {
        p[idx]++
      }
      setPixels(p)
    }
  }

  observable(() => web3Ctx.state.address!).subscribe(actions.updatePixels)

  mpContract.on('PixelsConjured(address,uint8[8])', (conjurer: string, rnds: number[]) => {
    // TODO: use the ethers filter instead of this if
    if (conjurer.toLowerCase() === web3Ctx.state.address!) {
      setState(produce(s => s.conjuringHistory.push(rnds)))
      if (state.conjuringHistory.length > 1) {
        actions.mergePixels(rnds)
      }
    }
  })

  return { actions, state }
}

export function MagicPixelsProvider(props: { children: JSX.Element }) {
  const context = makeMagicPixelsContext()

  return <MagicPixelsContext.Provider value={context}>
    {props.children}
  </MagicPixelsContext.Provider>
}