import { Accessor, onCleanup } from 'solid-js';

export default function tooltip(el: HTMLElement, tooltip: Accessor<string>) {
  if (!tooltip()) return;

  let tt: HTMLElement;
  const move = (e: MouseEvent) => {
    tt.style.cssText = `top: ${e.y - tt.clientHeight - 1}px; left: ${e.x}px;`;
  };

  const leave = () => {
    el.removeEventListener('mousemove', move);
    el.removeEventListener('mousedown', leave);
    el.removeEventListener('mouseleave', leave);
    tt.remove();
  };

  const show = (e: MouseEvent) => {
    tt = document.createElement('div');
    tt.className = 'tooltip';
    tt.innerText = tooltip();
    move(e);
    document.body.appendChild(tt);

    el.addEventListener('mousemove', move);
    el.addEventListener('mousedown', leave);
    el.addEventListener('mouseleave', leave);
  };

  el.addEventListener('mouseenter', show);
  onCleanup(() => {
    el.removeEventListener('mouseenter', show);
  });
}