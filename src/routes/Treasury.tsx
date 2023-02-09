import { Component, For, useContext } from 'solid-js'
import { MagicPixelsContext } from '../contexts/MagicPixels'
import { pixelColor } from '../helpers/color-utils'

const Treasury: Component = () => {
  const mpctx = useContext(MagicPixelsContext)!

  const allColors = Array(220).fill(1).map((_, i) => pixelColor(i + 1))

  const state = mpctx.state

  return <div class='grid'>
    <div class='grid grid-cols-10 gap-4 m-auto p-6 bg-white/8 backdrop-blur-lg overflow-auto h-[84vh]'>
      <For each={allColors}>
        {(color, i) => {
          const count = () => state.map[i()]
          return <div class={`h-12 w-12 border-4 border-white/40 text-white cursor-pointer`}
            style={{ 'background-color': color, 'opacity': count() ? 1 : 0.7 }}>
            <div class='drop-shadow-[0_0_2px_black] text-center'>{count() || ''}</div>
          </div>}}
      </For>
    </div>
  </div>
}

export default Treasury