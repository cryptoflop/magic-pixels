import { Accessor, createEffect, createMemo, JSX, splitProps } from 'solid-js';
import { pixelColor, pixelName } from '../helpers/color-utils';
import { rndBtwn } from '../helpers/utils';

import tooltipR from '../helpers/tooltip';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const tooltip = tooltipR;

export type PixelData = number[];

export default function Pixel(props: JSX.HTMLAttributes<HTMLDivElement> & { colors: PixelData; tooltip?: boolean; }) {
  const [local, elProps] = splitProps(props, ['colors', 'tooltip']);

  let div: HTMLDivElement;

  createEffect(() => {
    // cancel any animation
    div.getAnimations()[0]?.cancel();
    // set backgroundColor and animate if multiple colors
    if (local.colors.length === 1) {
      div!.style.background = pixelColor(local.colors[0]);
    } else {
      const stops = local.colors.map((color) => pixelColor(color));
      div!.animate(stops.map((s) => ({ backgroundColor: s })).concat([{ backgroundColor: stops[0] }]), {
        duration: stops.length * 1000,
        iterations: Infinity
        // easing: 'ease-in-out'
      }).currentTime = rndBtwn(0, 900);
    }
  }, [local.colors]);

  let info: Accessor<string> | undefined = undefined;
  if (local.tooltip !== false) {
    info = createMemo(() => {
      if (typeof local.colors === 'number') {
        return pixelName(local.colors);
      } else {
        return local.colors.map((color) => pixelName(color)).join(' > ');
      }
    }, [local.colors]);
  }

  return props.tooltip !== false ?
    <div use:tooltip={info} ref={r => div = r} {...elProps} />:
    <div ref={r => div = r} {...elProps} />;
}