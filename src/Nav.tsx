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
  const pink = pixelColor(20 * 10 + 7)
  return createSvg(8, 3, (_, x, y) => {
    const col = colorShade(pink, ((8 - x) * 0.4) + 0.4)
    return createSvgPixel(x, y, [col, colorShade(col, 1.6), col])
  })
}

export default function Nav() {
  return <div class='h-screen bg-white/8 backdrop-blur-lg'>
    <nav class='mb-auto grid select-none'>
      {routes.map(r => {
        const route = r.name.toLowerCase()
        const active = useMatch(() => route)

        return <NavLink href={route} title={r.name} class='grid cursor-pointer'>
          <div class='grid grid-cols-[min-content,1fr] px-4 py-0.5' use:svgBackground={active() ? [createPinkFadeSvg()] : []}>
            <img src={r.icon} class='m-2.5 min-w-[2rem]' />
            <div class='m-auto self-center text-lg'>{r.name}</div>
          </div>
        </NavLink>
      })}
    </nav>
  </div>
}