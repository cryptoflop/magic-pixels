import { useContext } from 'solid-js'
import { NavLink, useMatch } from 'solid-app-router'
import { createSvg, createSvgPixel } from './helpers/svg'
import { colorShade, pixelColor } from './helpers/color-utils'
import { Web3Context } from './contexts/Web3'

import svgBackground from './directives/svgBackground'
false && svgBackground

import { version } from '../package.json';

import nether from './assets/icons/nether.png'
import market from './assets/icons/auctionhouse.png'
import forge from './assets/icons/forge.png'
import treasury from './assets/icons/treasury.png'

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

function createPinkFadeSvg() {
  const pink = pixelColor(20 * 10 + 7)
  return createSvg(8, 3, (_, x, y) => {
    const col = colorShade(pink, 11 - 10 * Math.max(0, Math.sin((0.18 * x) - 4.71)))
    return createSvgPixel(x, y, [col, colorShade(col, 1.4), col])
  })
}

export default function Nav() {
  const web3Ctx = useContext(Web3Context)!

  return <div class='grid grid-rows-2 h-screen z-10'>
    <nav class='mb-auto grid select-none gap-8 mt-8'>
      {routes.map(r => {
        const route = r.name.toLowerCase()
        const active = useMatch(() => route)

        return <NavLink href={route} title={r.name} class='grid cursor-pointer'>
          <div class='grid grid-cols-[min-content,1fr] px-4 py-0.5 hover:bg-white/10'
            use:svgBackground={active() ? [createPinkFadeSvg()] : []}>
            <img src={r.icon} class='m-4 min-w-[32px] drop-shadow-[0_0_12px_#4c0025]' />
            <div class='m-auto self-center text-xl'>{r.name}</div>
          </div>
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