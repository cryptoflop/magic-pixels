import { Component, Index, onCleanup } from 'solid-js';
import Button from '../elements/Button';

import * as THREE from 'three';

import click from '../assets/click.mp3';
const clickAudio = new Audio(click);
clickAudio.volume = 0.4;

const Nether: Component = () => {
  const slotRefs: { container?: HTMLDivElement, children: (HTMLDivElement | undefined)[] }[] = Array(3)
    .fill(1)
    .map(() => ({ container: undefined, children: Array(5).fill(undefined) }));

  let mounted = true;

  const spinContainer = (ref: typeof slotRefs['0']) => {
    const clock = new THREE.Clock();
    const interval = 1 / 30;
    const acc = 1;
    const topSpeed = 26;
    let speed = 0;
    let delta = 0;
    const scroll = () => {
      delta += clock.getDelta();
      if (delta > interval) {
        delta = delta % interval;
            ref.container!.scrollTop -= speed;
            if (speed < topSpeed) {
              speed += acc;
            }
            if (ref.container!.scrollTop <= 0) {
              ref.container!.scrollTop = 104;
              clickAudio.play();
            }
      }
      mounted && requestAnimationFrame(scroll);
    };
    scroll();
  };

  const startSlotSpin = () => {
    for (let i = 0; i < slotRefs.length; i++) {
      const ref = slotRefs[i];
      ref.container!.scrollTop = 104;
      setTimeout(() => spinContainer(ref), 0);
    }
  };

  onCleanup(() => {
    mounted = false;
  });

  return <div className='bg-pink-500/70 flex flex-col p-8 pb-4 space-y-4 m-auto select-none'>
    <div className='bg-black/70 flex-grow flex p-4 space-x-4'>
      <Index each={slotRefs}>
        {(_, i) => <div ref={r => slotRefs[i].container = r}
          className='flex-grow bg-pink-500/20 text-white space-y-2 p-2 m-auto max-h-[320px] overflow-hidden'>
          <Index each={slotRefs[i].children}>
            {(_, si) => <div ref={r => slotRefs[i].children[si] = r}
              className='text-5xl md:text-8xl bg-pink-500 m-auto w-12 h-12 md:w-24 md:h-24 flex justify-center items-center'>?</div>}
          </Index>
        </div>}
      </Index>
    </div>
    <Button
      className='text-xl'
      onClick={startSlotSpin}>
      Conjure pixels
    </Button>
  </div>;
};

export default Nether;