import { Component } from 'solid-js';

const Button: Component<{ class?: string, disabled?: boolean; onClick?: () => void }> = (props) => {
  return <button
    onClick={props.onClick}
    disabled={props.disabled}
    class={`text-xl px-2 py-1 bg-pink-500 text-white border-default ${props.disabled && 'pointer-events-none opacity-75'}
              hover:bg-pink-600 active:bg-pink-700 select-none ${props.class}`}>
    {props.children}
  </button>;
};

export default Button;