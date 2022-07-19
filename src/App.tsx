import { Outlet } from 'solid-app-router';
import type { Component } from 'solid-js';
import NetherBack from './elements/NetherBack';
import { Nav } from './Nav';

const App: Component = () => {
  return <>
    <NetherBack />
    <div class='text-black dark:text-white grid grid-cols-[min-content,1fr]'>
      <Nav />
      <Outlet />
    </div>
  </>;
};

export default App;