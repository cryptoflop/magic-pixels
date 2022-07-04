import { Outlet } from 'solid-app-router';
import type { Component } from 'solid-js';

const App: Component = () => {
  return <>
    <Outlet />
  </>;
};

export default App;