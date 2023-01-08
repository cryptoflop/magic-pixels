import { createContext, JSX, Match, Switch } from 'solid-js'
import { createStore } from 'solid-js/store'

import { configureChains, connect, createClient, fetchBalance, fetchEnsName, InjectedConnector, mainnet, watchAccount } from '@wagmi/core'
import { publicProvider } from '@wagmi/core/providers/public'
import { WalletConnectConnector } from '@wagmi/core/connectors/walletConnect'
import { arbitrum } from '@wagmi/core/chains'

export const Web3Context = createContext<ReturnType<typeof makeWeb3Context>>();

function makeWeb3Context() {
  const [state, setState] = createStore<{
    connecting: boolean, address?: `0x${string}`,
    name?: string, balance?: string, pixels?: string
  }>({
    address: undefined, name: undefined, connecting: true,
    balance: undefined, pixels: undefined
  });

  const actions = {
    connect: () => {
      setState({ connecting: true })
      connect({
        connector: window.ethereum ?
          new InjectedConnector() :
          new WalletConnectConnector({
            chains: [mainnet, arbitrum],
            options: {
              qrcode: true
            }
          })
      }).catch(() => setState({ connecting: false }))
    },
    fetchEnsName: () => fetchEnsName({ address: state.address! }).then(ensName => ensName && setState({ name: ensName })),
    updateBalance: () => fetchBalance({ address: state.address! }).then(r => setState({ balance: r.formatted })),
    updatePixels: () => fetchBalance({ address: state.address!, token: '0x429881672B9AE42b8EbA0E26cD9C73711b891Ca5' })
      .then(r => setState({ pixels: r.formatted }))
  }

  const { provider, webSocketProvider } = configureChains(
    [mainnet, arbitrum],
    [publicProvider()]
  )

  const client = createClient({
    autoConnect: true,
    provider,
    webSocketProvider
  })

  watchAccount(acc => {
    if (acc.status === 'connected') {
      setState({ address: acc.address, connecting: false })
      actions.updateBalance()
      actions.updatePixels()
      actions.fetchEnsName()
    }

    if (acc.status === 'disconnected') {
      setState({
        address: undefined, name: undefined,
        balance: undefined, pixels: undefined
      })
    }
  })

  actions.connect()

  return { state, actions, client }
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
  </Web3Context.Provider>;
}