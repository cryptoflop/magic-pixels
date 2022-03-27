import { Component, For } from 'solid-js';
import Button from '../elements/Button';

const Nether: Component = () => {
  return <div className='bg-pink-500/70 flex flex-col p-8 pb-4 space-y-4 m-auto'>
    <div className='bg-black/70 flex-grow flex p-4 space-x-4'>
      <For each={Array(3).fill(1)}>
        {() => <div className='flex-grow bg-pink-500/20 text-white space-y-2 p-2 m-auto'>
          <For each={Array(3).fill(1)}>
            {() => <div className='text-5xl md:text-8xl bg-pink-500
                                      m-auto w-12 h-12 md:w-24 md:h-24 flex justify-center items-center'>?</div>}
          </For>
        </div>}
      </For>
    </div>
    <Button
      className='text-xl'
      onClick={() => 1}>
      Conjure pixels
    </Button>
  </div>;
};

export default Nether;