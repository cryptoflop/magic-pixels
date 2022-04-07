import { Outlet } from 'solid-app-router';
import type { Component } from 'solid-js';
import Menu from './elements/Menu';
import NetherBack from './elements/NetherBack';
import Wallet from './elements/Wallet';

const App: Component = () => {
  return <>
    <NetherBack />
    <div className='absolute h-[100vh] w-[100vw] grid grid-rows-[1fr,min-content]'>
      <div className='grid'>
        <Outlet />
      </div>
      <Menu />
    </div>
    <div className='absolute right-0 top-0'>
      <Wallet />
    </div>
  </>;
};

export default App;
