import { Component, Index } from 'solid-js';
import Pixel, { PixelData } from '../elements/Pixel';
import { DIMENSION } from '../elements/plate';
import { pixelColor } from '../helpers/color-utils';
import { rndBtwn } from '../helpers/utils';

const plateToSvg = (plate: PixelData[]) => {
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
                shape-rendering="optimizeSpeed" viewBox="0 0 16 16">`;
  for (let i = 0; i < plate.length; i++) {
    svg += `<rect width="1" height="1" x="${i % DIMENSION}" y="${Math.ceil((i + 1) / DIMENSION) - 1}" fill="${pixelColor(plate[i][0])}">
      <animate attributeName="fill" dur="3s" repeatCount="indefinite" begin="${rndBtwn(1, 1000) / 1000}s"
      values="${plate[i].concat([plate[i][0]]).map(p => pixelColor(p))
    .join(';')}" />
    </rect>`;
  }
  svg += '</svg>';
  return svg;
};

const Treasury: Component = () => {
  const pixels: PixelData[] = JSON.parse(localStorage.getItem('pixels') || '[]');
  const plates: PixelData[][] = JSON.parse(localStorage.getItem('plates') || '[]');

  return <div className='grid grid-cols-[min-content,1fr] text-white m-auto'>
    <div className='bg-pink-500/70 p-4 pt-2 mr-12'>
      <div className='pb-2'>Pixels</div>
      <div className='bg-black/70'>
        <div className='bg-pink-500/20 p-2 max-h-[80vh] overflow-auto flex space-x-2'>
          <div className='space-y-2'>
            <Index each={pixels}>
              {p => <Pixel colors={p()} className="h-12 w-12" />}
            </Index>
            { !pixels.length && 'Empty' }
          </div>
        </div>
      </div>
    </div>

    <div className='bg-pink-500/70 p-4 pt-2 m-auto'>
      <div className='pb-2'>Plates</div>
      <div className='bg-black/70'>
        <div className='bg-pink-500/20 p-2 space-y-2 max-h-[80vh] overflow-auto'>
          <Index each={plates}>
            {p => <img className='max-h-64 w-64' src={'data:image/svg+xml;utf8,' + encodeURIComponent(plateToSvg(p()))} />}
          </Index>
          { !plates.length && 'Empty' }
        </div>
      </div>
    </div>

  </div>;
};

export default Treasury;