import { Component } from 'solid-js';

const Button: Component<{ className?: string, onClick?: () => void }> = (props) => {
  return <button
    onClick={props.onClick}
    className={`text-xl px-4 py-1 bg-pink-500 text-white
              hover:bg-pink-600 active:bg-pink-700 select-none ${props.className}`}>
    {props.children}
  </button>;
};

export default Button;