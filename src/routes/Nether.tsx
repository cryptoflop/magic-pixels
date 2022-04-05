import { Component, createSignal, For, Index, onCleanup } from 'solid-js';
import Button from '../elements/Button';
import Pixel, { PixelData } from '../elements/Pixel';
import { rndColorIdx } from '../helpers/color-utils';

import * as THREE from 'three';

import coin from '../assets/coin.mp3';
const coinAudio = new Audio(coin);
coinAudio.volume = 0.2;

import click from '../assets/click.mp3';
const clickAudio = new Audio(click);
clickAudio.volume = 0.3;

import win from '../assets/win.mp3';
const winAudio = new Audio(win);
winAudio.volume = 0.3;

const Nether: Component = () => {
  const slotRefs: HTMLDivElement[] = Array(3)
    .fill(undefined);

  const empty = Array(3).fill(1)
    .map(() => Array(5).fill(undefined));
  const [conjured, setConjured] = createSignal<(PixelData | undefined)[][]>(empty);

  let active = false;

  const spinContainer = (ref: HTMLDivElement) => {
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
        ref.scrollTop -= speed;
        if (speed < topSpeed) {
          speed += acc;
        }
        if (ref.scrollTop <= 0) {
          ref.scrollTop = 104;
          clickAudio.play();
        }
      }
      if (active) {
        requestAnimationFrame(scroll);
      }
    };
    scroll();
  };

  const win = () => {
    active = false;
    for (const ref of slotRefs) {
      ref!.scrollTop = 0;
    }
    winAudio.play();

    const rndPxls = Array(9).fill(1)
      .map(() => {
      // this will happen in the smart contract
        return [rndColorIdx(), rndColorIdx()];
      });

    const stored = JSON.parse(localStorage.getItem('pixels') || '[]');
    localStorage.setItem('pixels', JSON.stringify([...stored].concat(rndPxls)));

    setConjured(Array(3)
      .fill(1)
      .map(() => Array(3)
        .fill(1)
        .map(() => rndPxls.pop())));
  };

  const startSlotSpin = () => {
    setConjured(empty);
    active = true;
    coinAudio.play();
    for (const ref of slotRefs) {
      ref!.scrollTop = 104;
      spinContainer(ref);
    }

    setTimeout(() => {
      win();
    }, 3500);
  };

  onCleanup(() => {
    active = false;
  });

  return <div className='bg-pink-500/70 flex flex-col p-8 pb-4 space-y-4 m-auto select-none'>
    <div className='bg-black/70 flex-grow flex p-4 space-x-4'>
      <Index each={slotRefs}>
        {(_, i) => <div ref={r => slotRefs[i] = r}
          className='flex-grow bg-pink-500/20 text-white space-y-2 p-2 m-auto max-h-[176px] md:max-h-[320px] overflow-hidden'>
          <For each={conjured()[i]}>
            {p => p ? <Pixel className='w-12 h-12 md:w-24 md:h-24' colors={p} /> :
              <div className='text-5xl md:text-8xl bg-pink-500 m-auto w-12 h-12 md:w-24 md:h-24 justify-center items-center flex'>?</div>}
          </For>
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