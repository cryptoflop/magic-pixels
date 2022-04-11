import { Accessor } from 'solid-js';

declare module 'solid-js' {
  namespace JSX {
    interface Directives {
      tooltip: Accessor<string>;
    }
  }
}