import { createContext, JSX, Match, Switch } from 'solid-js'
import { createStore } from 'solid-js/store'

import { ethers } from 'ethers'

export const Web3Context = createContext<ReturnType<typeof makeWeb3Context>>()

function makeWeb3Context() {
  const [state, setState] = createStore<{
    connecting: boolean, address?: `0x${string}`,
    name?: string, balance?: string, pixels?: string
  }>({
    address: undefined, name: undefined, connecting: true,
    balance: undefined, pixels: undefined
  })

  const provider = new ethers.providers.Web3Provider(window.ethereum! as unknown as ethers.providers.ExternalProvider)

  const actions = {
    connect: async () => {
      setState({ connecting: true })
      const accounts = await window.ethereum?.request<`0x${string}`[]>({ method: 'eth_requestAccounts' })
      if (accounts && accounts[0]) {
        const account = accounts[0]
        setState({ address: account })
        actions.updateBalance()
        actions.fetchEnsName()
      }
      setState({ connecting: false })
    },
    fetchEnsName: () => provider.lookupAddress(state.address!).then(ensName => ensName && setState({ name: ensName })).catch(() => void 0),
    updateBalance: () => provider.getBalance(state.address!).then(r => setState({ balance: r.toString() }))
  }

  window.ethereum?.on('accountsChanged', accounts => {
    if (!(accounts as string[])[0]) {
      setState({
        address: undefined, name: undefined,
        balance: undefined, pixels: undefined, connecting: false
      })
    }
  })

  actions.connect()

  return { provider, actions, state }
}

export function Web3Provider(props: { children: JSX.Element }) {
  const context = makeWeb3Context()

  const Header = () => <div class='absolute top-12 left-0 right-0 text-center text-2xl'>
    Magix Pixels
  </div>

  return <Web3Context.Provider value={context}>
    <Switch>
      <Match when={context.state?.connecting}>
        <Header />
        <div class='text-xl m-auto px-4 py-2 bg-white/10 backdrop-blur-lg'>
          Connecting...
        </div>
      </Match>
      <Match when={!context.state?.connecting && !context.state?.address}>
        <Header />
        <button class='text-xl m-auto px-4 py-2 bg-white/10 backdrop-blur-lg hover:bg-white/20' onClick={context.actions.connect}>
          Connect
        </button>
      </Match>
      <Match when={!context.state?.connecting && context.state?.address}>
        {props.children}
      </Match>
    </Switch>
  </Web3Context.Provider>
}