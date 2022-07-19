import { Component, createEffect } from 'solid-js';

import cloudF from '../assets/cloud_fore.png';
import cloudM from '../assets/cloud_mid.png';
import cloudB from '../assets/cloud_back.png';

const NetherBack: Component = () => {
  let back: HTMLDivElement;

  createEffect(() => {
    const createBg = (cloud: string, ms: number) => {
      const i = document.createElement('div');
      i.className = 'absolute bg-contain bg-repeat-x';
      i.style.imageRendering = 'pixelated';
      i.style.height = document.body.clientHeight + 'px';
      // 1.6 is the aspect ratio of the cloud pic
      const width = (1.6 * document.body.clientHeight);
      i.style.width = width * 3 + 'px';
      i.style.backgroundImage = 'url(' + cloud + ')';
      back.appendChild(i);

      i.animate([
        { transform: 'translate(0vw, 0)' },
        { transform: 'translate(-' + width + 'px,  0)' }
      ], {
        duration: ms,
        iterations: Infinity
      });
    };

    setTimeout(() => {
      createBg(cloudB, 80000);
      createBg(cloudM, 60000);
      createBg(cloudF, 40000);
    }, 100);
  });

  return <div class='h-screen w-screen fixed -z-10 '>
    <div class='inset-0 absolute bg-black' />
    <div ref={back!} />
  </div>;
};

export default NetherBack;