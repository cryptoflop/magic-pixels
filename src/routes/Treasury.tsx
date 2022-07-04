import { Component, Index } from 'solid-js';
import Container, { ContainerInner } from '../elements/Container';
import { PixelData } from '../elements/Pixel';
import { pixelsToSvg } from '../helpers/color-utils';

const Treasury: Component = () => {
  const plates: PixelData[][] = JSON.parse(localStorage.getItem('plates') || '[]');

  return <div class='grid text-white m-auto h-[75vh] w-[20rem]'>
    <Container class='flex-col overflow-y-hidden'>
      <div class='pb-2 -mt-2'>Plates</div>
      <ContainerInner class='grow overflow-y-hidden' classNameInner='overflow-auto grow overflow-y-auto space-y-2'>
        <Index each={plates}>
          {p => <img class='max-h-80 w-80' src={pixelsToSvg(p())} />}
        </Index>
        { !plates.length && 'Empty' }
      </ContainerInner>
    </Container>
  </div>;
};

export default Treasury;