import { NavLink, useMatch } from 'solid-app-router';
import { Component, For } from 'solid-js';

// import auctionhouse from '../assets/icons/auctionhouse.png';
import treasury from '../assets/icons/treasury.png';
import forge from '../assets/icons/forge.png';
import nether from '../assets/icons/nether.png';

const ROUTES = [
  ['Nether', nether],
  // ['Auctionhouse', auctionhouse],
  ['Forge', forge],
  ['Treasury', treasury]
];

const Menu: Component = () => {
  return <div class='text-white text-xl flex mx-auto bg-pink-900/70 stripeback select-none'>
    <For each={ROUTES}>
      {r => {
        const active = useMatch(() => r[0].toLowerCase());
        return <NavLink href={r[0].toLowerCase()}
          class={`w-[7.5rem] md:w-36 justify-center flex items-center px-1.5 py-0.5 m-auto hover:bg-pink-600
                       ${active() ? 'bg-pink-500' : ''}`}>
          <img class={`h-8 filter ${active() ? 'drop-shadow-[0_0_3px_white]' : 'drop-shadow-[0_0_5px_#ff88c3]'}`} src={r[1]} />
          <div class='flex-grow text-center'>{r[0]}</div>
        </NavLink>;
      }}
    </For>
  </div>;
};

export default Menu;