import { Component, createSignal, Index } from 'solid-js';
import { Portal } from 'solid-js/web';
import Button from '../elements/Button';
import Pixel, { PixelData } from '../elements/Pixel';
import { DIMENSION } from '../elements/plate';
import { BLACK, rndColorIdx } from '../helpers/color-utils';

const Forge: Component = () => {
  const availablePixels = Array(DIMENSION * 2)
    .fill(1)
    .map(() => [rndColorIdx(), rndColorIdx(), rndColorIdx(), rndColorIdx()]);

  const [pixels, setPixels] = createSignal<PixelData[]>(Array(DIMENSION ** 2).fill(1)
    .map(() => [BLACK]));

  const [draggingPixel, setDraggingPixel] = createSignal<PixelData>();
  let draggablePixel: HTMLDivElement;
  const movePixel = (e: MouseEvent) => {
    draggablePixel.style.setProperty('left', `${e.x - 22}px`);
    draggablePixel.style.setProperty('top', `${e.y - 22}px`);
  };

  const drag = (p: PixelData, e: MouseEvent) => {
    document.body.style.setProperty('cursor', 'grabbing');
    document.addEventListener('mousemove', movePixel);
    movePixel(e);
    setDraggingPixel(p);
  };

  const drop = (idx: number) => {
    document.body.style.setProperty('cursor', 'unset');
    document.removeEventListener('mousemove', movePixel);
    const s = [...pixels()];
    s[idx] = [...draggingPixel()!];
    setPixels(s);
    setDraggingPixel(undefined);
    // const apx = [...avlbPixels];
    // apx.splice(pixelIdx, 1);
  };

  return <div className='flex flex-col-reverse sm:flex-row-reverse text-white'>
    {/* Pixels */}
    <div className='m-auto sm:ml-8 overflow-x-scroll sm:overflow-y-scroll sm:overflow-x-hidden max-h-[80vh] max-w-[100vw]
      p-2 bg-pink-500/70 flex sm:flex-col'>
      <Button className='sticky -left-2 sm:-top-2 text-sm px-0 py-0.5 min-h-[3rem] min-w-[3rem]'>Filter</Button>
      <div className='grid grid-flow-col sm:grid-flow-row select-none'>
        {/* This could/should be optimized with a virtual list; or something that pauses the animation of pixels */}
        <Index each={availablePixels}>
          {p =>
            <Pixel className="h-12 w-12 border-4 border-black/30 cursor-grab"
              colors={p()} onMouseDown={[drag, p()]} />
          }
        </Index>
      </div>
    </div>
    {/* Draggable Pixel */}
    <Portal mount={document.getElementById('root')!}>
      <Pixel ref={r => draggablePixel = r}
        className={`h-12 w-12 z-10 absolute pointer-events-none  ${draggingPixel() ? '' : 'hidden'}`}
        colors={draggingPixel() || [BLACK]} />
    </Portal>

    {/* Plate */}
    <div className='bg-pink-500/70 p-2 aspect-square m-auto mr-0 grow grid
                    max-h-[100vw] max-w-[100vw] sm:max-h-[80vh] sm:max-w-[80vh]'>
      <div className='bg-white grid'
        style={{
          'grid-template-rows': `repeat(${DIMENSION}, 1fr)`,
          'grid-template-columns': `repeat(${DIMENSION}, 1fr)`
        }}>
        <Index each={pixels()}>
          {(p, i) => <Pixel className='hover:opacity-40' colors={p()} onMouseDown={[drop, i]} />}
        </Index>
      </div>
    </div>
  </div>;
};

export default Forge;