import { Component, createSignal, Index } from 'solid-js';
import { Portal } from 'solid-js/web';
import Button from '../elements/Button';
import Container, { ContainerInner } from '../elements/Container';
import Pixel, { PixelData } from '../elements/Pixel';
import { DIMENSION } from '../elements/plate';
import { EMPTY } from '../helpers/color-utils';

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

  const mint = () => {
    const storedPlates = JSON.parse(localStorage.getItem('plates') || '[]');
    localStorage.setItem('plates', JSON.stringify([...storedPlates].concat([[...pixels()]])));

    localStorage.setItem('pixels', JSON.stringify(availablePixels()));

    setPixels(Array(DIMENSION ** 2).fill(1)
      .map(() => [EMPTY]));
  };

  return <div className='flex flex-col-reverse sm:flex-row-reverse text-white'>
    {/* Pixels */}
    {/* TODO: rework this with grid */}
    <Container className='m-auto flex-row sm:flex-col sm:ml-8 min-w-[100vw] sm:min-h-[80vh] max-h-[80vh] sm:min-w-0 max-w-[100vw]'>
      <div className='flex flex-col mr-2 sm:mr-0 sm:mb-2 -ml-2 sm:-ml-0 -mt-2'>
        <div>Pixels</div>
        <Button className='text-sm grow'>Filter</Button>
      </div>
      <ContainerInner className='grow overflow-hidden'
        classNameInner={`overflow-x-auto sm:overflow-y-auto sm:overflow-x-hidden min-w-[4rem] block`}>
        <div className='grid grid-flow-col sm:grid-flow-row select-none space-x-1 sm:space-x-0 sm:space-y-1'>
          <Index each={availablePixels()}>
            {(p, i) =>
              <Pixel className="h-12 w-12 cursor-grab"
                colors={p()} onMouseDown={[drag, { idx: i, pixel: p() }]} />
            }
          </Index>
          { !availablePixels().length && 'Empty'}
        </div>
      </ContainerInner>
    </Container>

    {/* Draggable Pixel */}
    <Portal mount={document.getElementById('root')!}>
      <Pixel ref={r => draggablePixel = r}
        className={`h-12 w-12 z-10 absolute pointer-events-none  ${draggingPixel() ? '' : 'hidden'}`}
        colors={draggingPixel()?.pixel || [EMPTY]} />
    </Portal>

    {/* Plate */}
    <div className='bg-pink-500/70 p-2 aspect-square m-auto mr-0 grow grid relative
                    max-h-[100vw] max-w-[100vw] sm:max-h-[80vh] sm:max-w-[80vh] stripeback border-default'>
      <div className='bg-black/70 grid'
        style={{
          'grid-template-rows': `repeat(${DIMENSION}, 1fr)`,
          'grid-template-columns': `repeat(${DIMENSION}, 1fr)`
        }}>
        <Index each={pixels()}>
          {(p, i) => <Pixel className={`${p()[0] === EMPTY ? 'bg-black/20' : 'cursor-pointer'}`} colors={p()} onMouseUp={[drop, i]} />}
        </Index>
      </div>
      <Button className='absolute -bottom-9' onClick={mint}>Mint</Button>
    </div>
  </div>;
};

export default Forge;