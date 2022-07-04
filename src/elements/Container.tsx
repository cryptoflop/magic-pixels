import { Component, JSX } from 'solid-js';

export const ContainerInner: Component<{ class?: string, classNameInner?: string; }> = (props) => {
  return <div class={'bg-black/70 flex ' + props.class}>
    <div class={'bg-pink-500/20 p-2 border-default ' + props.classNameInner}>
      {props.children}
    </div>
  </div>;
};

const Container: Component<{ className?: string, style?: JSX.CSSProperties }> = (props) => {
  return <div style={props.style} class={'bg-pink-500/70 flex p-4 stripeback border-default ' + props.className}>
    {props.children}
  </div>;
};

export default Container;