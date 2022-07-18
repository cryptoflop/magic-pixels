import { For } from 'solid-js';
import Pixel from './Pixel';

export const DIMENSION = 16;

function Plate(props: { pixels: number[][] }) {
  return <div
    class="grid"
    style={{
      gridTemplateRows: `repeat(${DIMENSION}, 1fr)`,
      gridTemplateColumns: `repeat(${DIMENSION}, 1fr)`
    }}
  >
    <For each={props.pixels}>
      {pixel => <Pixel colors={pixel} />}
    </For>
  </div>;
}

export default Plate;

/* <svg viewBox={`0 0 ${DIMENSION} ${DIMENSION}`} xmlns="http://www.w3.org/2000/svg" shape-rendering='optimizeSpeed'>
  <Index each={pixels()}>
    {(p, i) => {
      const colors = p().map(c => colorInfo(c)[0]);
      return <rect fill={colors[0]} x={i % DIMENSION} y={Math.ceil((i + 1) / DIMENSION) - 1} width={1} height={1}>
        { colors.length > 0 && <animate attributeName="fill" values={colors
          .concat(colors[0])
          .join(';')
        } dur="3s" repeatCount="indefinite" begin={`${rndBtwn(0, 1000) / 1000}s`} /> }
      </rect>;
    }}
  </Index>
</svg> */