import { createSignal, Index, onMount } from 'solid-js'
import { colorShade, EMPTY, pixelColor } from './helpers/color-utils'
import { rndBtwn } from './helpers/utils'

const NetherSVG = (props: { from: string, to: string }) => {
  let svg: SVGSVGElement

  const [dim, setDim] = createSignal<{ w: number, h: number }>({ w: 0, h: 0 })
  const [pixels, setPixels] = createSignal<number[][]>([])

  onMount(() => {
    const pxlSize = 24
    setDim({ w: Math.ceil(svg.clientWidth / pxlSize) * 1.5, h: Math.ceil(svg.clientHeight / pxlSize) * 1.5 })

    let last = false
    setPixels(Array(dim().h * dim().w)
      .fill(1)
      .map(() => {
        if (!last && rndBtwn(0, 100) > 98) {
          last = true
          return [0]
        } else {
          last = false
          return [EMPTY]
        }
      }))

    svg.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 8000 })

    // TODO:
    svg.animate(
      [{ transform: `translate(${props.from}, 0px)` }, { transform: `translate(${props.to}, 0px)` }],
      { duration: 200000, iterations: Infinity }
    )
  })

  return <svg viewBox={`0 0 ${dim().w} ${dim().h}`} xmlns="http://www.w3.org/2000/svg"
    shape-rendering='optimizeSpeed' class='h-screen w-screen absolute' ref={svg!}>
    <Index each={pixels()}>
      {(p, i) => {
        if (p()[0] === EMPTY) return null

        const pink = pixelColor(20 * 10 + 7)
        const col = colorShade(pink, rndBtwn(1, 4))
        const colors = [col, colorShade(col, rndBtwn(2, 4)), col]
        const dims = dim()
        const x = i % dims.w
        const y = Math.ceil((i + 1) / dims.h) - 1
        if (x >= dims.w || y >= dims.h) return null

        return <rect fill={colors[1]} x={x} y={y} width={1} height={1}>
          {colors.length > 0 && <animate attributeName="fill" values={colors
            .concat(colors[0])
            .join(';')
          } dur={`${rndBtwn(2, 10)}s`} repeatCount="indefinite" begin={`${rndBtwn(20, 1000) / 1000}s`} />}
        </rect>
      }}
    </Index>
  </svg>
}

const NetherBack = () => {
  return <div class='h-screen w-screen fixed bg-black'>
    <NetherSVG from='0vw' to='-100vw' />
    <NetherSVG from='100vw' to='0vw' />
  </div>
}

export default NetherBack