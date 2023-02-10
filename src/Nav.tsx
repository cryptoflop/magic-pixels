import { onMount, useContext } from 'solid-js'
import { NavLink, useMatch } from 'solid-app-router'
import { Web3Context } from './contexts/Web3'

import { version } from '../package.json'

import nether from './assets/icons/nether.png'
import market from './assets/icons/auctionhouse.png'
import forge from './assets/icons/forge.png'
import treasury from './assets/icons/treasury.png'
import { rndBtwn } from './helpers/utils'
import { hex2rgb, pixelColor } from './helpers/color-utils'

const routes = [{
  name: 'Nether',
  icon: nether
},
{
  name: 'Market',
  icon: market
},
{
  name: 'Forge',
  icon: forge
},
{
  name: 'Treasury',
  icon: treasury
}]

function RouteBtn(props: { name: string, active: boolean }) {
  let back: HTMLDivElement
  onMount(() => {
    const num = 6

    back.onmouseenter = () => back.style.setProperty('--backopacity', props.active ? '1' : '0.6')
    back.onmouseleave = () => back.style.setProperty('--backopacity', props.active ? '1' : '0.2')

    const colors = Array(num).fill(1)
      .map(() => pixelColor(rndBtwn(5, 20) * 10 + 5))
      .map(hex => hex2rgb(hex))
      .map(rgb => ({ backgroundColor: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, var(--backopacity))` }))

    back.animate(colors.concat(colors[0]), {
      duration: (num * 4) * 1000,
      iterations: Infinity
    })
  })

  return <>
    <div class='absolute inset-0 transition-all' style={{ '--backopacity': props.active ? 1 : 0.4, 'filter': 'blur(40px)' }} ref={back!} />
    <div class='m-auto text-xl z-10 pointer-events-none'>{props.name}</div>
  </>
}

export default function Nav() {
  const web3Ctx = useContext(Web3Context)!

  return <div class='grid grid-rows-2 h-screen z-10'>
    <nav class='mb-auto grid select-none gap-12 mt-6 ml-6'>
      {routes.map(r => {
        const route = r.name.toLowerCase()
        const active = useMatch(() => route)

        return <NavLink href={route} title={r.name} class='grid cursor-pointer relative h-16'>
          <RouteBtn name={r.name} active={!!active()} />
        </NavLink>
      })}
    </nav>

    <footer class='mt-auto m-4 flex justify-between opacity-50'>
      <div title='MagicPixels Version' class='cursor-default'>
        v{version}
      </div>
      <div title='Current block' class='cursor-default'>
        #{web3Ctx.state.block}
      </div>
    </footer>
  </div>
}