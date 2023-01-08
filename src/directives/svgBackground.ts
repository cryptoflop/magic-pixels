import { Accessor, createRenderEffect } from 'solid-js'

export default function svgBackground(el: HTMLElement, value: Accessor<string[]>) {
  createRenderEffect(() => {
    const [svgData, size, repeat] = value()
    if (!svgData) return
    el.style.backgroundImage = `url("${svgData}")`
    el.style.backgroundSize = size || 'cover'
    el.style.backgroundRepeat = repeat || 'no-repeat'
  })
}