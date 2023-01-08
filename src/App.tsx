import { Outlet } from 'solid-app-router'
import { Web3Provider } from './contexts/Web3'
import NetherBack from './elements/NetherBack'
import WalletOutlet from './elements/WalletOutlet'
import { Nav } from './Nav'

export default function App() {
  return <>
    <NetherBack />
    <Web3Provider>
      <WalletOutlet />
      <div class='text-black dark:text-white grid grid-cols-[min-content,1fr]'>
        <Nav />
        <Outlet />
      </div>
    </Web3Provider>
  </>
}