import { Component, createMemo, createSignal, Index } from 'solid-js';
import { Portal } from 'solid-js/web';
import Button from '../elements/Button';
import Container, { ContainerInner } from '../elements/Container';
import Pixel, { PixelData } from '../elements/Pixel';
import { DIMENSION } from '../elements/plate';
import { EMPTY } from '../helpers/color-utils';

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
    <Container className='m-auto max-w-[100vw] sm:h-[70vh] sm:w-[75vh] lg:h-[80vh] lg:w-[85vh] text-white select-none'>
      <div className='grow grid grid-rows-[1fr,min-content] sm:grid-rows-none sm:grid-cols-[1fr,min-content] gap-2'>
        <div className='flex flex-col-reverse sm:flex-col'>
          {/* Plate */}
          <div className='aspect-square grid'>
            <ContainerInner classNameInner='px-0 py-0 grid grow'>
              <div className='grid'
                style={{ 'grid-template-rows': `repeat(${DIMENSION}, 1fr)`, 'grid-template-columns': `repeat(${DIMENSION}, 1fr)` }}>
                <Index each={pixels()}>
                  {(p, i) =>
                    <Pixel className={`${p()[0] === EMPTY ? '' : 'cursor-pointer'}`} colors={p()}
                      onMouseUp={[drop, i]} tooltip={false} />
                  }
                </Index>
              </div>
            </ContainerInner>
          </div>
          {/* Menu */}
          <div className='mb-2 sm:mt-2 sm:mb-auto flex'>
            <div className='mr-auto' use:tooltip={!canMint() ? 'Fill up the whole canvas to mint' : undefined}>
              <Button className='text-sm px-3' onClick={mint} disabled={!canMint()}>Mint</Button>
            </div>
          </div>
        </div>

        {/* Pixels */}
        <div className='flex flex-row sm:flex-col overflow-hidden'>
          <div className='flex flex-col mr-2 sm:mr-0 sm:mb-2'>
            <div className='leading-none mb-1'>Pixels</div>
            <Button className='text-sm grow'>Filter</Button>
          </div>
          {/* TODO: don't use static h and w */}
          <ContainerInner className='grid overflow-hidden h-4.5 sm:h-auto sm:w-[4.5rem] grow'
            classNameInner='overflow-y-auto'>
            <div className='grid grid-flow-col sm:grid-flow-row space-x-1.5 sm:space-x-0 sm:space-y-1.5'>
              <Index each={availablePixels()}>
                {(p, i) =>
                  <Pixel className="h-12 w-12 cursor-grab"
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
        className={`h-12 w-12 z-10 absolute pointer-events-none  ${draggingPixel() ? '' : 'hidden'}`}
        colors={draggingPixel()?.pixel || [EMPTY]}
        tooltip={false} />
    </Portal>
  </>;
};

export default Forge;