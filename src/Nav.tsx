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
  return <nav class='bg-black/50 mb-auto grid'>
    { routes.map(r => {
      const route = r.name.toLowerCase();
      const active = useMatch(() => route);
      return <NavLink href={route} title={r.name}
        class={`grid place-items-center cursor-pointer ${active() ? 'bg-pink-500' : 'bg-pink-900/70 hover:bg-pink-500/30'}`}>
        <div class='grid place-items-center'>
          <img src={r.icon} class={`m-1 min-w-[2rem] ${active() ? 'drop-shadow-[0_0_3px_white]' : 'drop-shadow-[0_0_5px_#ff88c3]'}`} />
          {/* <div style={{ 'writing-mode': 'vertical-rl' }}>{r.name}</div> */}
        </div>
      </NavLink>;
    }) }
  </nav>;
}