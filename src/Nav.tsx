import nether from './assets/icons/nether.png';
import market from './assets/icons/auctionhouse.png';
import forge from './assets/icons/forge.png';
import treasury from './assets/icons/treasury.png';
import { NavLink, useMatch } from 'solid-app-router';

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
  return <div class='h-screen bg-white/[0.08] backdrop-blur-lg'>
    <nav class='mb-auto grid m-2'>
      {routes.map(r => {
        const route = r.name.toLowerCase();
        const active = useMatch(() => route);
        return <NavLink href={route} title={r.name}
          class={`grid grid-cols-[min-content,1fr] m-2 pr-4 cursor-pointer ${active() ? 'bg-white/[0.08]' : 'bg-black/40 hover:bg-white/10'}`}>
          <div class='grid grid-flow-col'>
            <img src={r.icon} class={`m-2 mr-4 min-w-[2rem] `} />
            <div class='m-auto self-center text-lg '>{r.name}</div>
          </div>
        </NavLink>;
      })}
    </nav>
  </div>;
}