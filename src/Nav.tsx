import nether from './assets/icons/nether.png'
import market from './assets/icons/auctionhouse.png'
import forge from './assets/icons/forge.png'
import treasury from './assets/icons/treasury.png'
import { NavLink, useMatch } from 'solid-app-router'
import { createSvg, createSvgPixel } from './helpers/svg'
import { colorShade, pixelColor } from './helpers/color-utils'

import svgBackground from './directives/svgBackground'
false && svgBackground

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
  const pink = pixelColor(20 * 10 + 6)
  return createSvg(8, 3, (_, x, y) => {
    const col = colorShade(pink, 11 - 10 * Math.max(0, Math.sin((0.18 * x) - 4.71)))
    return createSvgPixel(x, y, [col, colorShade(col, 1.4), col])
  })
}

export default function Nav() {
  return <div class='h-screen bg-white/8 backdrop-blur-lg'>
    <nav class='mb-auto grid select-none gap-4 mt-4'>
      {routes.map(r => {
        const route = r.name.toLowerCase()
        const active = useMatch(() => route)

        return <NavLink href={route} title={r.name} class='grid cursor-pointer'>
          <div class='grid grid-cols-[min-content,1fr] px-4 py-0.5 bg-black hover:bg-white/5'
            use:svgBackground={active() ? [createPinkFadeSvg()] : []}>
            <img src={r.icon} class='m-2.5 min-w-[2rem] drop-shadow-[0_0_10px_#000]' />
            <div class='m-auto self-center text-lg'>{r.name}</div>
          </div>
        </NavLink>
      })}
    </nav>
  </div>
}