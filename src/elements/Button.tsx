import { Component } from 'solid-js';

const Button: Component<{ title?: string, className?: string, onClick?: () => void }> = (props) => {
  return <button
    onClick={props.onClick}
    title={props.title}
    className={`text-xl px-2 py-1 bg-pink-500 text-white border-default
              hover:bg-pink-600 active:bg-pink-700 select-none ${props.className}`}>
    {props.children}
  </button>;
};

export default Button;