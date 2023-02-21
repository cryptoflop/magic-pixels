import { For, onMount, useContext } from 'solid-js'
import { MagicPixelsContext } from '../contexts/MagicPixels'
import { rndBtwn } from '../helpers/utils'

function ConjureButton(props: { onClick?: () => void }) {
  return <button onClick={props.onClick} class='text-5xl m-auto p-4 hover:bg-white/20 drop-shadow-[0_0_6px_#000000]'>
    Conjure Pixels
  </button>
}

export default function Nether() {
  const mpCtx = useContext(MagicPixelsContext)!

  let container: HTMLDivElement

  onMount(() => {
    for (const child of container.children) {
      const CHANGE = 12
      let currDeg = rndBtwn(-CHANGE, CHANGE)
      let currPos = rndBtwn(-CHANGE, CHANGE)
      const anim = () => {
        const deg = rndBtwn(-CHANGE, CHANGE)
        const pos = currPos > 0 ? -CHANGE : CHANGE
        child.animate([
          { transform: `translate(0, ${currPos}px) rotate(${currDeg}deg)` },
          { transform: `translate(0, ${pos}px) rotate(${deg}deg)` }
        ], {
          duration: rndBtwn(4000, 6000),
          iterations: 1,
          easing: 'ease-in-out'
        }).onfinish = anim
        currDeg = deg
        currPos = pos
      }
      anim()
    }
  })

  return <div class='grid'>
    <div class='m-auto select-none grid grid-cols-4 grid-rows-2 gap-4 lg:gap-8 xl:gap-16' ref={container!}>
      <For each={Array(8).fill(1)}>
        {() => <div class={`grid place-items-center cursor-default hover:bg-white/10
          backdrop-blur-lg border-2 border-white/40 border-dashed
          text-2xl h-8 w-8
          lg:text-7xl lg:h-20 lg:w-20
          xl:text-8xl xl:h-32 xl:w-32
          2xl:text-9xl 2xl:h-44 2xl:w-44`}>
          <div>?</div>
        </div>}
      </For>
    </div>

    <ConjureButton onClick={mpCtx.actions.conjurePixels} />
  </div >
}