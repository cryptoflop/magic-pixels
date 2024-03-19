<script lang="ts">
	import { onMount } from "svelte";
	import { rndBtwn } from "../helpers/utils";
	import { pixelColor, rndColorIdx } from "../helpers/color-utils";

	import nebula from "../assets/images/nebula.png";

	let nebulas: HTMLDivElement;
	let pixels: HTMLDivElement;

	onMount(() => {
		const images = Array.from(nebulas.children) as HTMLDivElement[];

		images.forEach((img) => {
			let currX = 0;
			let currY = 0;
			const anim = () => {
				const posX = rndBtwn(-16, 16);
				const posY = rndBtwn(-6, 6) * (currY > 0 ? -1 : 1);
				img.animate(
					[
						{ transform: `translate(${currX}px, ${currY}px)` },
						{ transform: `translate(${posX}px, ${posY}px)` },
					],
					{
						duration: rndBtwn(6000, 8000),
						iterations: 1,
						easing: "ease-in-out",
					},
				).onfinish = anim;
				currX = posX;
				currY = posY;
			};
			anim();
		});

		return () => {
			images.forEach((el) => el.getAnimations().map((a) => a.cancel()));
		};
	});

	onMount(() => {
		function spawnPixel() {
			const pel = document.createElement("div");
			pel.className = "absolute pointer-events-none w-1 h-1";
			pel.style.transform = "translate(0, 0)";
			pixels.appendChild(pel);

			function rndPoint() {
				const w = pixels.clientWidth;
				const h = pixels.clientHeight;

				const wr = Math.round(rndBtwn(0, w));
				const hr = Math.round(rndBtwn(0, h));
				return [wr % 2 == 1 ? wr - 1 : wr, hr % 2 == 1 ? hr - 1 : hr] as const;
			}

			function move() {
				const [x, y] = rndPoint();
				pel.style.transform = `translate(${x}px, ${y}px)`;
			}

			function getColorStops() {
				return ["transparent", pixelColor(rndColorIdx(true)), "transparent"].map((s) => ({
					backgroundColor: s,
				}));
			}

			function animate() {
				if (!pixels) return;
				move();
				pel.animate(getColorStops(), {
					duration: 2200,
					delay: rndBtwn(0, 1400),
				}).onfinish = animate;
			}

			animate();
		}

		const pixelDensity = Math.round(
			(pixels.clientWidth * pixels.clientHeight) / 40000,
		);
		for (let i = 0; i < pixelDensity; i++) spawnPixel();

		return () => {
			Array.from(pixels.children).forEach((el) =>
				el.getAnimations().map((a) => a.cancel()),
			);
		};
	});
</script>

<div class="absolute inset-0 pointer-events-none z-[-1]">
	<div bind:this={nebulas}>
		<img
			src={nebula}
			class="absolute opacity-30 w-screen bottom-[60vh]"
			style="image-rendering: pixelated;"
		/>
		<img
			src={nebula}
			class="absolute opacity-30 w-screen top-[60vh]"
			style="image-rendering: pixelated;"
		/>
	</div>

	<div class="overflow-hidden absolute inset-0" bind:this={pixels} />
</div>
