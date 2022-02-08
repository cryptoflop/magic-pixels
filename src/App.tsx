import React, { useMemo, useState } from 'react';
import Menu from './elements/menu';
import Auctionhouse from './views/auctionhouse';
import Forge from './views/forge';
import Nether from './views/nether';
import Treasury from './views/treasury';

function App({}) {
  const [view, setView] = useState(3);
  const routes = useMemo(() => [<Nether />, <Auctionhouse />, <Forge />, <Treasury />], []);
  return (
    <div className="w-screen h-screen grid grid-rows-[max-content,1fr] grid-cols-1 gap-4 p-4 bg-sate-50 dark:bg-[#141a1e] text-pink-500 text-xl">
      <div>
        <Menu view={view} setView={setView} />
      </div>
      <div className="border-pink-500 relative">{routes[view]}</div>
    </div>
  );
}

export default App;
