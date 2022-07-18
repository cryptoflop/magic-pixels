import { Component, createEffect } from 'solid-js';

import cloud from '../assets/cloud1.png';

const NetherBack: Component = () => {
  let back: HTMLDivElement;

  createEffect(() => {
    setTimeout(() => {
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
        duration: 33300,
        iterations: Infinity
      });
    }, 100);
  });

  return <div class='h-screen w-screen fixed -z-10 '>
    <div class='inset-0 absolute bg-black' />
    <div ref={back!} />
  </div>;
};

export default NetherBack;