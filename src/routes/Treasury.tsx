import { Component, Index } from 'solid-js';
import Container, { ContainerInner } from '../elements/Container';
import { PixelData } from '../elements/Pixel';
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
  const plates: PixelData[][] = JSON.parse(localStorage.getItem('plates') || '[]');

  return <div className='grid text-white m-auto'>
    <Container className='flex-col'>
      <div className='pb-2 -mt-2'>Plates</div>
      <ContainerInner className='grow' classNameInner='h-[80vh] min-w-[12rem] sm:min-w-[16rem] overflow-auto grow'>
        <Index each={plates}>
          {p => <img className='max-h-64 w-64' src={'data:image/svg+xml;utf8,' + encodeURIComponent(plateToSvg(p()))} />}
        </Index>
        { !plates.length && 'Empty' }
      </ContainerInner>
    </Container>
  </div>;
};

export default Treasury;