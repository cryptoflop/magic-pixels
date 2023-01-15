import { Outlet } from 'solid-app-router'
import { MagicPixelsProvider } from './contexts/MagicPixels'
import { Web3Provider } from './contexts/Web3'
import NetherBack from './NetherBack'
import WalletOutlet from './elements/WalletOutlet'
import Nav from './Nav'

export default function App() {
  return <>
    <NetherBack />
    <Web3Provider>
      <MagicPixelsProvider>
        <WalletOutlet />
        <div class='text-black dark:text-white grid grid-cols-[min-content,1fr]'>
          <Nav />
          <Outlet />
        </div>
      </MagicPixelsProvider>
    </Web3Provider>
  </>
}