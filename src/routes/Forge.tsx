import { Component, createMemo, createSignal, For, Index } from 'solid-js';
import { Portal } from 'solid-js/web';
import Button from '../elements/Button';
import Container, { ContainerInner } from '../elements/Container';
import Pixel, { PixelData } from '../elements/Pixel';
import { DIMENSION } from '../elements/plate';
import { EMPTY, pixelColor, pixelName } from '../helpers/color-utils';

import colorPallet from '../assets/pixel-colors.json';

import tooltipR from '../helpers/tooltip';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const tooltip = tooltipR;

const Forge: Component = () => {
  const [availablePixels, setAvailablePixels] = createSignal<PixelData[]>(JSON.parse(localStorage.getItem('pixels') || '[]'));

  const [pixels, setPixels] = createSignal<PixelData[]>(Array(DIMENSION ** 2).fill(1)
    .map(() => [EMPTY]));

  const [draggingPixel, setDraggingPixel] = createSignal<{ idx: number; pixel: PixelData }>();
  let draggablePixel: HTMLDivElement;
  const movePixel = (e: MouseEvent) => {
    draggablePixel.style.setProperty('left', `${e.x - 22}px`);
    draggablePixel.style.setProperty('top', `${e.y - 22}px`);
  };

  const drag = (data: { idx: number, pixel: PixelData }, e: MouseEvent) => {
    document.body.style.setProperty('cursor', 'grabbing');
    document.addEventListener('mousemove', movePixel);
    movePixel(e);
    setDraggingPixel(data);
  };

  const drop = (idx: number) => {
    document.body.style.setProperty('cursor', 'unset');
    document.removeEventListener('mousemove', movePixel);

    const s = [...pixels()];
    const dp = draggingPixel();
    if (s[idx][0] === EMPTY && !dp) return;

    const apx = [...availablePixels()];
    if (dp) {
      apx.splice(dp.idx, 1);
      if (s[idx][0] !== EMPTY) {
        apx.unshift(s[idx]);
      }
    } else {
      apx.unshift(s[idx]);
    }
    setAvailablePixels(apx);

    s[idx] = [...dp?.pixel || [EMPTY]];
    setDraggingPixel(undefined);
    setPixels(s);
  };

  const canMint = createMemo(() => !pixels().some(p => p[0] === EMPTY), [pixels]);
  const mint = () => {
    const storedPlates = JSON.parse(localStorage.getItem('plates') || '[]');
    localStorage.setItem('plates', JSON.stringify([...storedPlates].concat([[...pixels()]])));

    localStorage.setItem('pixels', JSON.stringify(availablePixels()));

    setPixels(Array(DIMENSION ** 2).fill(1)
      .map(() => [EMPTY]));
  };

  return <>
    <Container class='m-auto max-w-[100vw] sm:h-[70vh] sm:w-[75vh] lg:h-[80vh] lg:w-[85vh] text-white select-none relative'>
      <div class='border-default bg-pink-500/90 absolute grid overflow-hidden
                      -bottom-[2px] top-[20%] sm:bottom-[20%] sm:-top-[2px] -left-[2px] -right-[2px] '>
        <div class='bg-black/60 flex flex-col overflow-hidden'>
          <div class='w-full border-b-2 border-pink-500'>
            <label><input type='checkbox' class=''></input>Exact order</label>
          </div>
          <div class='grow overflow-y-auto'>
            <Index each={Array(22).fill(1)}>
              {(_, pi) => <div class='flex justify-center'><Index each={Array(10).fill(1)}>
                {(_, ti) => <Pixel class='w-10 h-10 cursor-pointer' colors={[((pi) * 10) + ti + 1]} />}
              </Index></div>}
            </Index>
          </div>
        </div>
      </div>

      <div class='grow grid grid-rows-[1fr,min-content] sm:grid-rows-none sm:grid-cols-[1fr,min-content] gap-4'>
        <div class='flex flex-col-reverse sm:flex-col'>
          {/* Plate */}
          <div class='aspect-square grid'>
            <ContainerInner classNameInner='px-0 py-0 grid grow'>
              <div class='grid'
                style={{ 'grid-template-rows': `repeat(${DIMENSION}, 1fr)`, 'grid-template-columns': `repeat(${DIMENSION}, 1fr)` }}>
                <Index each={pixels()}>
                  {(p, i) =>
                    <Pixel class={`${p()[0] === EMPTY ? '' : 'cursor-pointer'}`} colors={p()}
                      onMouseUp={[drop, i]} tooltip={false} />
                  }
                </Index>
              </div>
            </ContainerInner>
          </div>
          {/* Menu */}
          <div class='mb-2 sm:mt-2 sm:mb-auto flex'>
            <div class='mr-auto' use:tooltip={!canMint() ? 'Fill up the whole canvas to mint' : undefined}>
              <Button class='text-sm px-3' onClick={mint} disabled={!canMint()}>Mint</Button>
            </div>
          </div>
        </div>

        {/* Pixels */}
        <div class='flex flex-row sm:flex-col overflow-hidden'>
          <div class='flex flex-col mr-2 sm:mr-0 sm:mb-2'>
            <div class='leading-none mb-1'>Pixels</div>
            <Button class='text-sm grow'>Filter</Button>
          </div>
          {/* TODO: don't use static h and w */}
          <ContainerInner class='grid overflow-hidden h-4.75 sm:h-auto sm:w-[4.75rem] grow'
            classNameInner='overflow-y-auto'>
            <div class='grid grid-flow-col sm:grid-flow-row space-x-1.5 sm:space-x-0 sm:space-y-1.5'>
              <Index each={availablePixels()}>
                {(p, i) =>
                  <Pixel class="h-12 w-12 cursor-grab"
                    colors={p()} onMouseDown={[drag, { idx: i, pixel: p() }]} />
                }
              </Index>
              { !availablePixels().length && 'Empty'}
            </div>
          </ContainerInner>
        </div>
      </div>
    </Container>

    {/* Draggable Pixel */}
    <Portal mount={document.getElementById('root')!}>
      <Pixel ref={r => draggablePixel = r}
        class={`h-12 w-12 z-10 absolute pointer-events-none  ${draggingPixel() ? '' : 'hidden'}`}
        colors={draggingPixel()?.pixel || [EMPTY]}
        tooltip={false} />
    </Portal>
  </>;
};

export default Forge;