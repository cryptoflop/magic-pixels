import { createContext, JSX, Match, Switch } from 'solid-js'
import { createStore } from 'solid-js/store'

import { ethers } from 'ethers'
import DemoProvider, { createDemoProviderProxyLogger } from '../helpers/DemoProvider'
import EnsureCtx from '../helpers/EnsureCtx'

export const Web3Context = createContext<ReturnType<typeof makeWeb3Context>>()

function makeWeb3Context() {
  const [state, setState] = createStore<{
    connecting: boolean, address?: string, block?: string
    name?: string, balance?: string, pixels?: string
  }>({
    address: undefined, name: undefined, connecting: true,
    balance: undefined, pixels: undefined, block: undefined
  })

  const provider = new ethers.providers.Web3Provider(
    // createDemoProviderProxyLogger(window.ethereum!) as unknown as ethers.providers.ExternalProvider
    // window.ethereum! as unknown as ethers.providers.ExternalProvider
    // createDemoProviderProxyLogger(new DemoProvider(
    //   '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
    //   '0x5fbdb2315678afecb367f032d93f642f64180aa3'
    // )) as unknown as ethers.providers.ExternalProvider
    new DemoProvider(
      '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
      '0x5fbdb2315678afecb367f032d93f642f64180aa3'
    ) as unknown as ethers.providers.ExternalProvider
  )

  const actions = {
    connect: async () => {
      setState({ connecting: true })
      const accounts = await window.ethereum?.request<string[]>({ method: 'eth_requestAccounts' })
      if (accounts && accounts[0]) {
        const account = accounts[0]
        setState({ address: account.toLowerCase() })
        actions.updateBalance()
        actions.fetchEnsName()
      }
      setState({ connecting: false })
    },
    fetchEnsName: () => provider.lookupAddress(state.address!).then(ensName => ensName && setState({ name: ensName })).catch(() => void 0),
    updateBalance: () => provider.getBalance(state.address!).then(r => setState({ balance: r.toString() }))
  }

  provider.on('accountsChanged', accounts => {
    if (!(accounts as string[])[0]) {
      setState({
        address: undefined, name: undefined, block: undefined,
        balance: undefined, pixels: undefined, connecting: false
      })
    }
  })

  provider.on('block', block => setState({ block }))

  actions.connect()

  return { provider, actions, state }
}

export function Web3Provider(props: { children: JSX.Element }) {
  const ctx = makeWeb3Context()

  const Header = () => <div class='absolute top-12 left-0 right-0 text-center text-2xl'>
    Magix Pixels
  </div>

  return <Web3Context.Provider value={ctx}>
    <EnsureCtx context={Web3Context}>
      <Switch>
        <Match when={ctx.state.connecting}>
          <Header />
          <div class='text-xl m-auto px-4 py-2 bg-white/10 backdrop-blur-lg'>
          Connecting...
          </div>
        </Match>
        <Match when={!ctx.state.connecting && !ctx.state.address}>
          <Header />
          <button class='text-xl m-auto px-4 py-2 bg-white/10 backdrop-blur-lg hover:bg-white/20' onClick={ctx.actions.connect}>
          Connect
          </button>
        </Match>
        <Match when={!ctx.state.connecting && ctx.state.address}>
          {props.children}
        </Match>
      </Switch>
    </EnsureCtx>
  </Web3Context.Provider>
}