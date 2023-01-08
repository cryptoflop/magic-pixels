import { Match, Show, Switch, useContext } from 'solid-js'
import { Web3Context } from '../contexts/Web3'

export default function WalletOutlet() {
  const context = useContext(Web3Context)
  const state = context?.state

  return <div class="grid grid-cols-[min-content,min-content,min-content] gap-4
    absolute right-2 top-2 px-4 py-2 bg-white/10 backdrop-blur-lg">
    <div class='whitespace-nowrap' title='Ether'>
      <Show when={!state?.connecting}>
        {(state!.balance ? state!.balance.slice(0, 4) : '0') + ' Ξ'}
      </Show>
    </div>

    <Switch>
      <Match when={state?.connecting}>
        Connecting...
      </Match>
      <Match when={!state?.connecting && !state?.address}>
        Connect
      </Match>
      <Match when={!state?.connecting}>
        <div class='flex' title='Pixels'>
          {/* TODO: format */}
          {/* {(state!.pixels ? state!.pixels.slice(0, 4) : '0')} */}
          12
          <div class='ml-1 self-center w-3 h-3 border border-white/80' />
        </div>
      </Match>
    </Switch>

    <div class='whitespace-nowrap' title='Address'>
      <Show when={!state?.connecting && state?.address && !state?.name}>
        {state!.address!.slice(0, 6) + '...'}
      </Show>

      <Show when={!state?.connecting && state?.name}>
        {state!.name}
      </Show>
    </div>
  </div>
}