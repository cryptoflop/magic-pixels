import { createEffect, JSX, splitProps } from 'solid-js';
import { pixelColor } from '../helpers/color-utils';
import { rndBtwn } from '../helpers/utils';

export type PixelData = number[];

export default function Pixel(props: JSX.HTMLAttributes<HTMLDivElement> & { colors: PixelData; }) {
  const [local, elProps] = splitProps(props, ['colors']);

  let div: HTMLDivElement;

  createEffect(() => {
    if (typeof local.colors === 'number') {
      div!.style.background = pixelColor(local.colors);
    } else {
      const stops = local.colors.map((color) => pixelColor(color));
      div!.animate(stops.map((s) => ({ backgroundColor: s })).concat([{ backgroundColor: stops[0] }]), {
        duration: stops.length * 1000,
        iterations: Infinity
        // easing: 'ease-in-out'
      }).currentTime = rndBtwn(0, 900);
    }
  }, [local.colors]);

  return <div ref={r => div = r} {...elProps} />;
}