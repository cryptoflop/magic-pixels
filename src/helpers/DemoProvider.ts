import { BigNumber, utils } from 'ethers'

import MagicPixelsArtifact from '../../Contracts/artifacts/contracts/MagicPixels.sol/MagicPixels.json'
import { rndBtwn } from './utils'
const MP_INTERFACE = new utils.Interface(MagicPixelsArtifact.abi)

const ENS = '0x00000000000c2e074ec69a0dfb2997ba6c7d2e1e'

const RETURN_VALUES = {
  ERROR: '0x',
  NULL: '0x0'
}

export default class DemoProvider {

  public host?: string = undefined
  public path?: string = undefined

  public blockNumber = BigNumber.from(1)

  public balances: { [key: string]: BigNumber | undefined } = {}

  public mpState = {
    pixels: Array(220).fill(0).map(v => BigNumber.from(v))
  }

  constructor(public account: string, public mpContract: string) {
    this.balances[account] = BigNumber.from(1000)

    this.request = this.request.bind(this)
  }

  public request(req: { method: string, params: unknown[] }) {
    return new Promise((res, rej) => {
      const strIdxSelf = (this as unknown as { [key: string]: (...args: unknown[]) => unknown[] })
      if (strIdxSelf[req.method]) {
        res(strIdxSelf[req.method](...req.params))
      } else {
        rej(console.warn('Tried to call function unkown to the DemoProvider', req.method))
      }
    })
  }

  public eth_chainId() {
    return '0x1'
  }

  public eth_accounts() {
    return [this.account]
  }

  public eth_blockNumber() {
    return this.blockNumber.toHexString()
  }

  public eth_getBalance(account: string) {
    return this.balances[account]?.toHexString() ?? BigNumber.from(0).toHexString()
  }

  public eth_getLogs(call: { address: string, fromBlock: string, toBlock: string, topics: string[] }) {
    // TODO: return logs for blocks
    return []
  }

  public eth_getTransactionByHash(params: [string]) {
    // TODO: return transaction
    return []
  }

  public eth_call(call: { to: string, data: string, from?: string, value?: string }) {
    switch (call.to) {
    case ENS:
      // here an abitrary ens name could be returned, but for now we return a null address
      return ['0x0000000000000000000000000000000000000000000000000000000000000000']
    case this.mpContract:
      return this.mp_contract(call.from!, call.data, call.value!)
    default:
      return RETURN_VALUES.ERROR
    }
  }

  public eth_sendTransaction(tx: { data: string, from: string, gas: string, to: string, value?: string }) {
    switch (tx.to) {
    case this.mpContract:
      return this.mp_contract(tx.from!, tx.data, tx.value!)
    default:
      return RETURN_VALUES.ERROR
    }
  }

  public mp_contract(from: string, data: string, value: string) {
    const input = MP_INTERFACE.parseTransaction({ data, value })
    switch (input.name) {
    case 'getAllPixels':
      return MP_INTERFACE.encodeFunctionResult(input.signature, [this.mpState.pixels.map(bn => bn.toNumber())])
    case 'mintPixels': {
      // const conjuror = input.args[0] as string
      Array(8).fill(1).map(() => rndBtwn(0, 220)).forEach(pxl => this.mpState.pixels[pxl].add(1))
      this.blockNumber.add(1)
      return RETURN_VALUES.NULL
    }
    }
  }

}


// quick and dirty proxy that logs any interaction between an ethereum provider and a convenience library like ethers
export function createDemoProviderProxyLogger(provider: object) {
  return new Proxy(provider, {
    get(...args) {
      const orgProp = Reflect.get(...args)
      if (typeof orgProp === 'function') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (...argsI: any[]) => {
          const res = orgProp(...argsI)
          if (args[1] === 'request') {
            (res as Promise<unknown>).then(result => {
              console.log('request', { method: argsI[0].method, params: argsI[0].params , result })
              if (argsI[0]?.params[0]?.to === '0x5fbdb2315678afecb367f032d93f642f64180aa3') {
                const MP_INTERFACE = new utils.Interface(MagicPixelsArtifact.abi)
                const inter = MP_INTERFACE.parseTransaction(argsI[0].params[0])
                // MagicPixels contract interaction
                console.log('MPCI', {
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  method: inter.signature, params: inter.args, result: MP_INTERFACE.decodeFunctionResult(inter.signature, result as any)
                })
              }
            })
          } else {
            console.log('Fn call', args[1], res, argsI)
          }
          return res
        }
      } else {
        console.log('Get', args[1], orgProp)
        return orgProp
      }
    }
  })
}