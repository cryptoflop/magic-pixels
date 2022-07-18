import { Outlet } from 'solid-app-router';
import type { Component } from 'solid-js';
import NetherBack from './elements/NetherBack';

const App: Component = () => {
  return <div class='text-black dark:text-white'>
    <NetherBack />
    <Outlet />
  </div>;
};

export default App;