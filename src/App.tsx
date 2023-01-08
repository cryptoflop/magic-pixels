import { Outlet } from 'solid-app-router';
import type { Component } from 'solid-js';
import { Web3Provider } from './contexts/Web3';
import NetherBack from './elements/NetherBack';
import WalletOutlet from './elements/WalletOutlet';
import { Nav } from './Nav';

const App: Component = () => {
  return <>
    <Web3Provider>
      <NetherBack />
      <WalletOutlet />
      <div class='text-black dark:text-white grid grid-cols-[min-content,1fr]'>
        <Nav />
        <Outlet />
      </div>
    </Web3Provider>
  </>;
};

export default App;