import { Context, JSX, useContext } from 'solid-js'

export default function EnsureCtx(props: { context: Context<unknown>, children: JSX.Element }) {
  const ctx = useContext(props.context)

  return ctx ? props.children : null
}