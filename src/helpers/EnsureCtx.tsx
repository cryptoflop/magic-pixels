import { Context, JSX, useContext } from 'solid-js'

export default function EnsureCtx(props: { context: unknown, children: JSX.Element }) {
  const ctx = useContext(props.context as Context<unknown>)

  return ctx ? props.children : null
}