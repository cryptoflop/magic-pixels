import React, { useRef, useState } from 'react';
import useThreeQuad from '../hooks/useThreeQuad';

import frag from '../assets/frag';
import vert from '../assets/vert';
import { colorInfo, rndColorIdx } from 'src/helpers/color-utils';
import Pixel from 'src/elements/pixel';

function Nether({}) {
  const [result, setResult] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<HTMLDivElement>(null);

  const [pixels, setPixels] = useState(
    Array(10)
      .fill(1)
      .map(() => [rndColorIdx(), rndColorIdx()])
  );

  useThreeQuad(containerRef, rendererRef, frag, vert, document.body);

  return (
    <div className="absolute w-full h-full grid grid-rows-1 grid-cols-1">
      <div className="grid row-[1] col-[1]">
        <div className="grow" ref={containerRef}></div>
        <div className="absolute" ref={rendererRef}></div>
      </div>
      <div className="flex flex-col-reverse row-[1] col-[1] z-10">
        {result ? (
          <div className="m-auto bg-pink-500 grid grid-cols-2 p-4 gap-x-6 gap-y-2 glow-shadow">
            {pixels.map((p, i) => (
              <div key={i} className="flex items-center text-white space-x-2">
                <Pixel className="h-12 w-12" colors={p} />
                <div className={'grid gap-x-1 grow ' + (p.length > 1 ? 'grid-cols-2' : 'grid-cols-1')}>
                  {p.map((color, ic) => (
                    <span className="text-center" key={ic}>
                      {colorInfo(color)[1]}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <button
            className="m-auto text-4xl p-4 bg-pink-500/60 text-white/95 hover:bg-pink-500/80 transition-all hover:scale-110"
            onClick={() => setResult(true)}
          >
            Conjure a Pixel
          </button>
        )}
      </div>
    </div>
  );
}

export default Nether;
