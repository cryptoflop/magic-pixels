import { Outlet } from 'solid-app-router';
import type { Component } from 'solid-js';
import Menu from './elements/Menu';
import NetherBack from './elements/NetherBack';

const App: Component = () => {
  return <>
    <NetherBack />
    <div className='absolute h-[100vh] w-[100vw] grid grid-rows-[1fr,min-content]'>
      <div className='grid'>
        <Outlet />
      </div>
      <Menu />
    </div>
  </>;
};

export default App;
