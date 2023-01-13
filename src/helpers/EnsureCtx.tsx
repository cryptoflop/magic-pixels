import { JSX } from 'solid-js'

export default function EnsureCtx(props: { context: unknown, children: JSX.Element }) {
  return props.context ? props.children : null
}