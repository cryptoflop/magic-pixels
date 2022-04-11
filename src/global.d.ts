// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as solid from 'solid-js';

declare module 'solid-js' {
  namespace JSX {
    interface Directives {
      tooltip: string
    }
  }
}