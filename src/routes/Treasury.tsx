import { Component, Index } from 'solid-js';
import Pixel, { PixelData } from '../elements/Pixel';

const Treasury: Component = () => {
  const pixels: PixelData[] = JSON.parse(localStorage.getItem('pixels') || '[]');

  const plates: PixelData[][] = JSON.parse(localStorage.getItem('plates') || '[]');

  return <div className='grid grid-cols-2'>
    <div className='bg-pink-500/70 m-auto p-2'>
      <Index each={pixels}>
        {p => <Pixel colors={p()} className="h-12 w-12" />}
      </Index>
    </div>

    <div className='bg-pink-500/70 m-auto p-2'>
      <Index each={plates}>
        {p => {
          let dataUri =
            '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" shape-rendering="optimizeSpeed" viewBox="0 0 16 16">';
          dataUri += '<rect width="1" height="1" x="0" fill="#84cc16" y="0"><animate attributeName="fill" dur="3s" repeatCount="indefinite" values="#84cc16;#e11d48;#84cc16" begin="0.633s"></animate></rect>';
          dataUri += '</svg>';
          return <img className='h-32 w-32' src={'data:image/svg+xml;utf8,' + encodeURIComponent(dataUri)} />;
        }}
      </Index>
    </div>
  </div>;
};

export default Treasury;