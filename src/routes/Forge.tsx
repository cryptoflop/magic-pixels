import { Component, createSignal, Index } from 'solid-js';
import { Portal } from 'solid-js/web';
import Button from '../elements/Button';
import Pixel, { PixelData } from '../elements/Pixel';
import { DIMENSION } from '../elements/plate';
import { BLACK, rndColorIdx } from '../helpers/color-utils';

const Forge: Component = () => {
  const [availablePixels, setAvailablePixels] = createSignal<PixelData[]>(Array(DIMENSION * 2)
    .fill(1)
    .map(() => [rndColorIdx(), rndColorIdx(), rndColorIdx(), rndColorIdx()]));

  const [pixels, setPixels] = createSignal<PixelData[]>(Array(DIMENSION ** 2).fill(1)
    .map(() => [BLACK]));

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
    if (s[idx][0] === BLACK && !dp) return;

    const apx = [...availablePixels()];
    if (dp) {
      apx.splice(dp.idx, 1);
    } else {
      apx.unshift(s[idx]);
    }
    setAvailablePixels(apx);

    s[idx] = [...dp?.pixel || [BLACK]];
    setDraggingPixel(undefined);
    setPixels(s);
  };

  const mint = () => {
    const stored = JSON.parse(localStorage.getItem('plates') || '[]');
    localStorage.setItem('plates', JSON.stringify([...stored].concat([[...pixels()]])));
  };

  return <div className='flex flex-col-reverse sm:flex-row-reverse text-white'>
    {/* Pixels */}
    {/* TODO: rework this with grid */}
    <div className='m-auto sm:ml-8 overflow-x-scroll sm:overflow-y-scroll sm:overflow-x-hidden
                    min-w-[100vw] sm:min-h-[80vh] max-h-[80vh] sm:min-w-0 max-w-[100vw]
      p-2 bg-pink-500/70 flex sm:flex-col'>
      <Button className='sticky -left-2 sm:-top-2 text-sm'>Filter</Button>
      <div className='bg-black/70'>
        <div className='bg-pink-500/20 p-2'>
          <div className='grid grid-flow-col sm:grid-flow-row select-none space-x-2 sm:space-x-0 sm:space-y-2'>
            {/* This could/should be optimized with a virtual list; or something that pauses the animation of pixels */}
            <Index each={availablePixels()}>
              {(p, i) =>
                <Pixel className="h-12 w-12 cursor-grab"
                  colors={p()} onMouseDown={[drag, { idx: i, pixel: p() }]} />
              }
            </Index>
          </div>
        </div>
      </div>
    </div>
    {/* Draggable Pixel */}
    <Portal mount={document.getElementById('root')!}>
      <Pixel ref={r => draggablePixel = r}
        className={`h-12 w-12 z-10 absolute pointer-events-none  ${draggingPixel() ? '' : 'hidden'}`}
        colors={draggingPixel()?.pixel || [BLACK]} />
    </Portal>

    {/* Plate */}
    <div className='bg-pink-500/70 p-2 aspect-square m-auto mr-0 grow grid relative
                    max-h-[100vw] max-w-[100vw] sm:max-h-[80vh] sm:max-w-[80vh]'>
      <div className='bg-white grid'
        style={{
          'grid-template-rows': `repeat(${DIMENSION}, 1fr)`,
          'grid-template-columns': `repeat(${DIMENSION}, 1fr)`
        }}>
        <Index each={pixels()}>
          {(p, i) => <Pixel className='hover:opacity-40' colors={p()} onMouseUp={[drop, i]} />}
        </Index>
      </div>
      <Button className='absolute -bottom-9' onClick={mint}>Mint</Button>
    </div>
  </div>;
};

export default Forge;