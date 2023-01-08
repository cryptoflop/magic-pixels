import { Show, useContext } from 'solid-js'
import { Web3Context } from '../contexts/Web3'

export default function WalletOutlet() {
  const context = useContext(Web3Context)
  const state = context?.state

  return <div class='grid grid-cols-[min-content,min-content,min-content] gap-4 px-4 py-2
    absolute right-2 top-2 bg-white/10 backdrop-blur-lg'>

    <Show when={!state?.connecting && state?.address}>
      <div class='whitespace-nowrap' title='Ether'>
        {(state!.balance ? state!.balance.slice(0, 4) : '0.00') + ' Ξ'}
      </div>
    </Show>

    <Show when={!state?.connecting}>
      <div class='flex' title='Pixels'>
        {/* TODO: format */}
        {/* {(state!.pixels ? state!.pixels.slice(0, 4) : '0')} */}
        12
        <div class='ml-1 self-center w-3 h-3 border border-white/80' />
      </div>
    </Show>

    <Show when={!state?.connecting && state?.address}>
      <div class='whitespace-nowrap' title='Address'>
        <Show when={!state?.name}>
          {state!.address!.slice(0, 6) + '...'}
        </Show>
        <Show when={state?.name}>
          {state!.name}
        </Show>
      </div>
    </Show>

  </div>
}