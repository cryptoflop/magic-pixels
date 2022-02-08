import React, { useEffect, useRef } from 'react';
import { colorInfo } from 'src/helpers/color-utils';
import { rndBtwn } from '../helpers/utils';

function Pixel(props: { colors: number[]; className?: string }) {
  const div = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stops = props.colors.map((color) => colorInfo(color)[0]);
    if (stops.length < 2) {
      div.current!.style.background = stops[0];
    } else {
      div.current!.animate(stops.map((s) => ({ background: s })).concat([{ background: stops[0] }]), {
        duration: stops.length * 1000,
        iterations: Infinity
        // easing: 'ease-in-out'
      }).currentTime = rndBtwn(0, 900);
    }
  }, [props.colors]);

  return <div className={props.className} ref={div}></div>;
}

export default Pixel;
