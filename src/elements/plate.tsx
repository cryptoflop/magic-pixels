import React from 'react';
import Pixel from './pixel';

export const DIMENSION = 20;

function Plate(props: { pixels: number[][] }) {
  return (
    <div
      className="grid"
      style={{
        gridTemplateRows: `repeat(${DIMENSION}, 1fr)`,
        gridTemplateColumns: `repeat(${DIMENSION}, 1fr)`
      }}
    >
      {props.pixels.map((pixel, i) => (
        <Pixel key={i} colors={pixel} />
      ))}
    </div>
  );
}

export default Plate;
