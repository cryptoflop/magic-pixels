import { Component, createEffect, For } from 'solid-js';
import { rndBtwn } from '../helpers/utils';

const Nether: Component = () => {
  let container: HTMLDivElement;

  createEffect(() => {
    for (const child of container.children) {
      const CHANGE = 16;
      let currDeg = rndBtwn(-CHANGE, CHANGE);
      let currPos = rndBtwn(-CHANGE, CHANGE);
      const anim = () => {
        const deg = rndBtwn(-CHANGE, CHANGE);
        const pos = currPos > 0 ? -CHANGE : CHANGE;
        child.animate([
          { transform: `translate(0, ${currPos}px) rotate(${currDeg}deg)` },
          { transform: `translate(0, ${pos}px) rotate(${deg}deg)` }
        ], {
          duration: rndBtwn(4000, 6000),
          iterations: 1,
          easing: 'ease-in-out'
        }).onfinish = anim;
        currDeg = deg;
        currPos = pos;
      };
      anim();
    }
  });

  return <div class='grid grid-rows-[3fr,2fr]'>
    <div class='mt-auto mx-auto grid grid-flow-col gap-2 lg:gap-6 xl:gap-8' ref={container!}>
      <For each={Array(10).fill(1)}>
        { () => <div class={`grid place-items-center bg-black/60
          text-2xl h-8 w-8
          lg:text-7xl lg:h-20 lg:w-20
          xl:text-8xl xl:h-24 xl:w-24
          2xl:text-9xl 2xl:h-32 2xl:w-32`}>
          <div>?</div>
        </div> }
      </For>
    </div>

    {/* hover:animate-none hover:scale-110 transition-transform animate-pulsate */}
    <button class='text-5xl m-auto p-6 relative'>
      <div class='absolute inset-0 bg-black/40 animate-pulsate' />
      Conjure Pixels
    </button>
  </div>;
};

export default Nether;