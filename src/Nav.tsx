import { Accessor, useContext } from 'solid-js'
import { NavLink, useMatch } from 'solid-app-router'
import { Web3Context } from './contexts/Web3'

import { version } from '../package.json'

import nether from './assets/icons/nether.png'
import market from './assets/icons/auctionhouse.png'
import forge from './assets/icons/forge.png'
import treasury from './assets/icons/treasury.png'

const routes = [{
  name: 'Nether',
  icon: nether
},
{
  name: 'Market',
  icon: market
},
{
  name: 'Forge',
  icon: forge
},
{
  name: 'Treasury',
  icon: treasury
}]

function RouteBtn(props: { name: string, active: boolean }) {
  return <div class='m-auto text-2xl drop-shadow-[0_0_6px_black] hover:underline'
    style={{ 'text-decoration': props.active ? 'underline' : 'none' }}>
    {props.name}
  </div>
}

export default function Nav() {
  const web3Ctx = useContext(Web3Context)!

  return <div class='grid grid-rows-2 h-screen z-10'>
    <nav class='mb-auto grid select-none gap-12 mt-6 ml-6'>
      {routes.map(r => {
        const route = r.name.toLowerCase()
        const active = useMatch(() => route)

        return <NavLink href={route} title={r.name} class='grid cursor-pointer relative h-16'>
          <RouteBtn name={r.name} active={!!active()} />
        </NavLink>
      })}
    </nav>

    <footer class='mt-auto m-4 flex justify-between opacity-50'>
      <div title='MagicPixels Version' class='cursor-default'>
        v{version}
      </div>
      <div title='Current block' class='cursor-default'>
        #{web3Ctx.state.block}
      </div>
    </footer>
  </div>
}