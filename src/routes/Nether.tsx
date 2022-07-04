import { Component, createSignal, For, Index, onCleanup } from 'solid-js';
import Button from '../elements/Button';
import Pixel, { PixelData } from '../elements/Pixel';
import { rndColorIdx } from '../helpers/color-utils';
import Container, { ContainerInner } from '../elements/Container';

import * as THREE from 'three';

import coin from '../assets/sounds/coin.mp3';
const coinAudio = new Audio(coin);
coinAudio.volume = 0.2;

import click from '../assets/sounds/click.mp3';
const clickAudio = new Audio(click);
clickAudio.volume = 0.2;

import win from '../assets/sounds/win.mp3';
import { rndBtwn } from '../helpers/utils';
const winAudio = new Audio(win);
winAudio.volume = 0.3;

const Nether: Component = () => {
  const slotRefs: HTMLDivElement[] = Array(3)
    .fill(undefined);

  const empty = Array(3).fill(1)
    .map(() => Array(5).fill(undefined));
  const [conjured, setConjured] = createSignal<(PixelData | undefined)[][]>(empty);

  let active = false;
  let stopping = false;

  const spinContainer = (ref: HTMLDivElement) => {
    const clock = new THREE.Clock();
    const interval = 1 / 30;
    const maxVelocity = 26;
    let acc = 1;
    let velocity = 0;
    let delta = 0;
    let shouldStop = false;
    const stop = () => {
      stopping = false;
      win();
    };
    const scroll = () => {
      delta += clock.getDelta();
      if (delta > interval) {
        delta = delta % interval;
        if (stopping) {
          if (ref.scrollTop === 104) {
            shouldStop = true;
            acc = 0.15;
          }
          if (shouldStop) {
            velocity -= acc;
            if (velocity <= 0) {
              stop();
              return;
            }
          }
          ref.scrollTop -= velocity;
        } else {
          ref.scrollTop -= velocity;
          if (velocity < maxVelocity) {
            velocity += acc;
          }
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
      // the randomness is just for demo cases
        return Array(rndBtwn(1, 4)).fill(1)
          .map(() => rndColorIdx());
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
      stopping = true;
    }, 2000);
  };

  onCleanup(() => {
    active = false;
  });

  return <Container class="space-y-4 m-auto flex-col p-8 pb-4">
    <ContainerInner classNameInner='space-x-2 select-none flex'>
      <Index each={slotRefs}>
        {(_, i) => <div ref={r => slotRefs[i] = r}
          class='flex-grow text-white space-y-2 max-h-[160px] md:max-h-[304px] overflow-hidden'>
          <For each={conjured()[i]}>
            {p => p ? <Pixel class='w-12 h-12 md:w-24 md:h-24' colors={p} /> :
              <div class='text-5xl md:text-8xl bg-pink-500 m-auto w-12 h-12 md:w-24 md:h-24
                              justify-center items-center flex stripeback border-default'>
                ?
              </div>}
          </For>
        </div>}
      </Index>
    </ContainerInner>

    <Button
      class='text-xl -mb-2'
      onClick={startSlotSpin}>
      Conjure pixels
    </Button>
  </Container>;
};

export default Nether;