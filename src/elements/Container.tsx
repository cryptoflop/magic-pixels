import { Component, JSX } from 'solid-js';

export const ContainerInner: Component<{ className?: string, classNameInner?: string; }> = (props) => {
  return <div className={'bg-black/70 flex ' + props.className}>
    <div className={'bg-pink-500/20 p-2 ' + props.classNameInner}>
      {props.children}
    </div>
  </div>;
};

const Container: Component<{ className?: string, style?: JSX.CSSProperties }> = (props) => {
  return <div style={props.style} className={'bg-pink-500/70 flex p-4 stripeback border-default ' + props.className}>
    {props.children}
  </div>;
};

export default Container;