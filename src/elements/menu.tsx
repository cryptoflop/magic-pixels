import React, { useMemo } from 'react';

import auctionhouse from '../assets/icons/auctionhouse.png';
import treasury from '../assets/icons/treasury.png';
import forge from '../assets/icons/forge.png';
import nether from '../assets/icons/nether.png';
import Account from './account';

function Menu(props: { view: number; setView: (v: number) => void }) {
  const routes = useMemo(
    () => [
      ['Nether', nether],
      ['Auctionhouse', auctionhouse],
      ['Forge', forge],
      ['Treasury', treasury]
    ],
    []
  );
  return (
    <div className="flex">
      <div className="flex space-x-4 select-none">
        {routes.map((r, i) => (
          <div
            key={i}
            onClick={() => props.setView(i)}
            className={
              'flex items-center space-x-2 cursor-pointer transition-colors motion-reduce:transition-none px-2 py-0.5  ' +
              (props.view === i ? 'bg-pink-500 text-white' : '')
            }
          >
            <img
              className={
                'h-[32px] filter ' +
                (props.view === i ? 'drop-shadow-[0_0_3px_white]' : 'drop-shadow-[0_0_5px_#ff88c3]')
              }
              src={r[1]}
            />
            <span className="text-xl">{r[0]}</span>
          </div>
        ))}
      </div>

      <div className="grid ml-auto">
        <Account />
      </div>
    </div>
  );
}

export default Menu;
