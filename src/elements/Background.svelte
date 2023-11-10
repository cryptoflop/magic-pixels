<script lang="ts">
	import { onMount } from "svelte";
	import { rndBtwn } from "../helpers/utils";
	import { pixelColor, rndColorIdx } from "../helpers/color-utils";

	let el: HTMLDivElement;

	onMount(() => {
		function spawnPixel() {
			const pel = document.createElement("div");
			pel.style.position = "absolute";
			pel.style.height = "4px";
			pel.style.width = "4px";
			pel.style.pointerEvents = "none";
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
				pel.style.top = y + "px";
				pel.style.left = x + "px";
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
			for (const pel of el.children) pel.getAnimations().map((a) => a.cancel());
		};
	});
</script>

<div
	class="select-none overflow-hidden absolute inset-0 z-[-1]"
	bind:this={el}
/>
