import { pixelColor, rndColorIdx } from "../helpers/color-utils";
import { rndBtwn } from "../helpers/utils";

export type EmitterOptions = {
	active: boolean,
	colored?: boolean,
	intensity?: number,
	density?: number,
	spread?: number,
	opacity?: number
}

export function pixelemitter(element: HTMLElement, options: EmitterOptions) {
	const amount = Math.floor(((element.clientHeight + element.clientWidth) / 10) * (options.density ?? 1))

	const pool = document.createElement("div")

	const pixels = Array(amount).fill(1).map(() => {
		const el = document.createElement("div")
		el.style.position = "absolute";
		el.style.height = "4px";
		el.style.width = "4px";
		el.style.pointerEvents = "none";
		return el
	})
	pixels.forEach(p => pool.appendChild(p))

	pool.style.display = "none"

	const getZIndex = (n: HTMLElement): number => {
		const zi = Number(window.getComputedStyle(n).getPropertyValue('z-index'))
		return isNaN(zi) ? (n.parentElement ? getZIndex(n.parentElement) : 0) : zi
	}
	pool.style.zIndex = "-1"
	element.style.zIndex = String(getZIndex(element))

	pool.style.position = "absolute"
	pool.className = "inset-0"
	element.style.position = "relative"
	element.appendChild(pool)

	const centerX = element.clientWidth / 2;
	const centerY = element.clientHeight / 2;

	function moveAlongLine(x: number, y: number, distance: number) {
		const magnitude = Math.sqrt(x * x + y * y);

		const normalizedX = x / magnitude;
		const normalizedY = y / magnitude;

		return [x + normalizedX * (distance * 10), y + normalizedY * (distance * 10)]
	}

	function rndPoint() {
		const w = element.clientWidth;
		const h = element.clientHeight;

		const x = rndBtwn(1, w) - centerX;
		const y = rndBtwn(1, h) - centerY;

		const [ex, ey] = moveAlongLine(x, y, 1.5)

		return [x + centerX, ex + centerX, y + centerY, ey + centerY]
	}

	let active = false

	function animatePixel(el: HTMLElement) {
		function animate() {
			if (!active) return
			const duration = 740 - (740 * ((options.intensity ?? 1) - 1))
			const [xStart, xEnd, yStart, yEnd] = rndPoint();
			el.animate([
				{ transform: `translate(${xStart}px, ${yStart}px)`, backgroundColor: "transparent" },
				{ backgroundColor: ((options.colored ?? true) ? pixelColor(rndColorIdx(true)) : "#ffffff") + (options.opacity ? Math.floor(options.opacity * 255).toString(16) : '') },
				{ transform: `translate(${xEnd}px, ${yEnd}px)`, backgroundColor: "transparent" }
			], {
				duration: duration,
				delay: rndBtwn(0, duration)
			}).onfinish = animate;
		}
		animate();
	}

	let stopId: number

	function start() {
		clearTimeout(stopId)
		pool.style.display = "initial"
		active = true
		pixels.forEach((p) => animatePixel(p))
	}

	function stop() {
		active = false
		stopId = setTimeout(() => pool.style.display = "none", 800 * 2) as unknown as number
	}

	if (options.active) {
		start()
	}

	return {
		update(newOptions: EmitterOptions) {
			options = newOptions

			if (options.active !== undefined && active !== options.active) {
				options.active ? start() : stop()
			}
		},

		destroy() {
			element.removeChild(pool)
		}
	}
}