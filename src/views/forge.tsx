import React, { useState } from 'react';
import Pixel from 'src/elements/pixel';
import { BLACK, colorInfo, rndColorIdx } from 'src/helpers/color-utils';
import Plate, { DIMENSION } from '../elements/plate';

function Forge({}) {
  const [pixels, setPixels] = useState<number[][]>(Array(DIMENSION ** 2).fill([BLACK]));

  const [pixelIdx, setPixelIdx] = useState(0);
  const [avlbPixels, setAvlbPixels] = useState(
    Array(DIMENSION * 2)
      .fill(1)
      .map(() => [rndColorIdx(), rndColorIdx()])
  );

  const usePixel = (pixel: number[], idx: number) => {
    setPixelIdx(idx);
  };

  const applyPixel = (idx: number) => {
    if (avlbPixels.length === 0) {
      return;
    }
    const s = [...pixels];
    s[idx] = [...avlbPixels[pixelIdx]];
    setPixels(s);
    const apx = [...avlbPixels];
    apx.splice(pixelIdx, 1);
    setAvlbPixels(apx);
    setPixelIdx(0);
  };

  return (
    <div className="absolute w-full h-full grid grid-cols-[14rem,4fr] gap-4">
      <div className="border-2 border-pink-500 overflow-y-scroll space-y-2 py-2">
        {avlbPixels.map((p, i) => (
          <div
            key={i}
            className={
              'border-2  mx-2 flex items-center cursor-pointer ' +
              (pixelIdx === i ? 'bg-pink-500 border-pink-500 text-white' : 'bg-pink-300 border-pink-300 text-pink-600')
            }
            onClick={() => usePixel(p, i)}
          >
            <Pixel className="h-12 w-12" colors={p} />
            <div className={'grid text-base grow ' + (p.length > 1 ? 'grid-cols-2' : 'grid-cols-1')}>
              {p.map((color, ic) => (
                <span className="text-center" key={ic}>
                  {colorInfo(color)[1]}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="border-2 border-pink-500 grid m-auto aspect-square h-full cursor-pointer">
        <div className="col-[1] row-[1] grid">
          <Plate pixels={pixels} />
        </div>
        <div
          className="col-[1] row-[1] grid gap-[1px]"
          style={{
            gridTemplateRows: `repeat(${DIMENSION}, 1fr)`,
            gridTemplateColumns: `repeat(${DIMENSION}, 1fr)`
          }}
        >
          {pixels.map((_, i) => (
            <div key={i} className="opacity-0" onClick={() => applyPixel(i)}></div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Forge;
