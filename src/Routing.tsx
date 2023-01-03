import { Navigate, Route, Routes } from 'solid-app-router';
import { Component, lazy } from 'solid-js';

import App from './App';
import Market from './routes/Market';

const Nether = lazy(() => import('./routes/Nether'));
const Forge = lazy(() => import('./routes/Forge'));
const Treasury = lazy(() => import('./routes/Treasury'));

const Routing: Component = () => {
  return <Routes>
    <Route path="/" element={<App />}>
      <Route path="/nether" element={<Nether />} />
      <Route path="/market" element={<Market />} />
      <Route path="/forge" element={<Forge />} />
      <Route path="/treasury" element={<Treasury />} />
      <Route path="/*all" element={<Navigate href="/nether" />} />
    </Route>
  </Routes>;
};

export default Routing;
