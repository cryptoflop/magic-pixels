import nether from './assets/icons/nether.png';
import market from './assets/icons/auctionhouse.png';
import forge from './assets/icons/forge.png';
import treasury from './assets/icons/treasury.png';
import { NavLink, useMatch } from 'solid-app-router';
import { createSvg, createSvgPixel } from './helpers/svg';
import { BLACK, colorShade, pixelColor } from './helpers/color-utils';

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
}];

export function Nav() {
  return <div class='h-screen bg-white/8 backdrop-blur-lg'>
    <nav class='mb-auto grid select-none'>
      {routes.map(r => {
        const route = r.name.toLowerCase();
        const active = useMatch(() => route);

        const pink = pixelColor(20 * 10 + 7)
        return <NavLink href={route} title={r.name}
          class={`grid grid-cols-[min-content,1fr] my-2 pr-4 
                  cursor-pointer ${active() ? 'bg-white/8' : 'bg-black/40 hover:bg-white/10'}`}
          style={{
            'background-repeat': 'no-repeat',
            'background-image': active() ?
              `url("${createSvg(6, 2, (_, x, y) => createSvgPixel(x, y, [pink, colorShade(pink, 2), pink]))}")` :
              ''
          }}>
          <div class='grid grid-flow-col'>
            <img src={r.icon} class={`m-2 mr-4 min-w-[2rem]`} />
            <div class='m-auto self-center text-lg '>{r.name}</div>
          </div>
        </NavLink>;
      })}
    </nav>
  </div>;
}