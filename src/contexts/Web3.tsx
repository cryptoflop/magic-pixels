import { createContext, JSX } from 'solid-js'
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
      })
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

  return <Web3Context.Provider value={context}>
    {props.children}
  </Web3Context.Provider>;
}