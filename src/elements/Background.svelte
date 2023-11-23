<script lang="ts">
	import { onMount } from "svelte";
	import { rndBtwn } from "../helpers/utils";
	import { pixelColor, rndColorIdx } from "../helpers/color-utils";

	let el: HTMLDivElement;

	onMount(() => {
		function spawnPixel() {
			const pel = document.createElement("div");
			pel.className = "absolute pointer-events-none w-1 h-1";
			pel.style.transform = "translate(0, 0)";
			el.appendChild(pel);

			function rndPoint() {
				const w = el.clientWidth;
				const h = el.clientHeight;

				const wr = Math.round(rndBtwn(0, w));
				const hr = Math.round(rndBtwn(0, h));
				return [wr % 2 == 1 ? wr - 1 : wr, hr % 2 == 1 ? hr - 1 : hr] as const;
			}

			function move() {
				const [x, y] = rndPoint();
				pel.style.transform = `translate(${x}px, ${y}px)`;
			}

			function getColorStops() {
				return ["black", pixelColor(rndColorIdx(true)), "black"].map((s) => ({
					backgroundColor: s,
				}));
			}

			function animate() {
				if (!el) return;
				move();
				pel.animate(getColorStops(), {
					duration: 3000,
					delay: rndBtwn(0, 1400),
				}).onfinish = animate;
			}

			animate();
		}

		const pixelDensity = Math.round((el.clientWidth * el.clientHeight) / 40000);
		for (let i = 0; i < pixelDensity; i++) spawnPixel();

		return () => {
			Array.from(el.children).forEach((pel) =>
				pel.getAnimations().map((a) => a.cancel()),
			);
		};
	});
</script>

<div
	class="select-none overflow-hidden absolute inset-0 z-[-1]"
	bind:this={el}
/>
