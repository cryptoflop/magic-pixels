import { Accessor, onCleanup } from 'solid-js';

export default function tooltip(el: Element, tooltip: Accessor<Accessor<string>>) {
  // console.log(tooltip()());

  // onCleanup(() => console.log(1));
}