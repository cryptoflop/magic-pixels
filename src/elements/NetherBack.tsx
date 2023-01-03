import { Component, createEffect, createSignal, Index } from 'solid-js';
import { BLACK, EMPTY, pixelColor } from '../helpers/color-utils';
import { rndBtwn } from '../helpers/utils';

const NetherBack: Component = () => {
  let back: HTMLDivElement;

  const [dim, setDim] = createSignal<{ w: number, h: number }>({ w: 0, h: 0 });
  const [pixels, setPixels] = createSignal<number[][]>([]);

  createEffect(() => {
    const pxlSize = 24;
    setDim({ w: Math.ceil(back.clientWidth / pxlSize), h: Math.ceil(back.clientHeight / pxlSize) });

    const pink = 20 * 10 + 7;
    let last = false;
    setPixels(Array(dim().h * dim().w)
      .fill(1)
      .map(() => {
        if (!last && rndBtwn(0, 100) > 96) {
          last = true;
          return [pink, BLACK, pink];
        } else {
          last = false;
          return [EMPTY];
        }
      }));

    back.children[0].animate([{ opacity: 0 }, { opacity: 1 }], { duration: 10000 });
  });

  return <div class='h-screen w-screen fixed bg-black' ref={back!}>
    <svg viewBox={`0 0 ${dim().w} ${dim().h}`} xmlns="http://www.w3.org/2000/svg" shape-rendering='optimizeSpeed'
      class='h-screen w-screen'>
      <Index each={pixels()}>
        {(p, i) => {
          if (p()[0] === EMPTY) return null;

          const colors = p().map(c => pixelColor(c));
          const dims = dim();
          const x = i % dims.w;
          const y = Math.ceil((i + 1) / dims.h) - 1;
          if (x >= dims.w || y >= dims.h) return null;

          return <rect fill={colors[1]} x={x} y={y} width={1} height={1}>
            {colors.length > 0 && <animate attributeName="fill" values={colors
              .concat(colors[0])
              .join(';')
            } dur={`${rndBtwn(5, 10)}s`} repeatCount="indefinite" begin={`${rndBtwn(20, 1000) / 1000}s`} />}
          </rect>;
        }}
      </Index>
    </svg>
  </div>;
};

export default NetherBack;