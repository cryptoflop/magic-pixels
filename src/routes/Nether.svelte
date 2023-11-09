<script lang="ts">
	import { afterUpdate, beforeUpdate, getContext } from "svelte";
	import Pixel from "../elements/Pixel.svelte";
	import PixelizedButton from "../elements/PixelizedButton.svelte";
	import { tooltip } from "../directives/tooltip";
	import { EMPTY, fullPixelName } from "../helpers/color-utils";
	import { rndBtwn } from "../helpers/utils";
	import { PIXEL_PRICE } from "../values";
	import type { createWeb3Ctx } from "../contexts/web3";
	import { formatEther } from "viem";

	import qackSrc from "../assets/quack.mp3";
	import clickSrc from "../assets/click.mp3";
	import sparkleSrc from "../assets/sparkle.mp3";
	import { createAudio } from "../helpers/audio";
	import { decodePixel } from "../../contracts/scripts/libraries/pixel-parser";

	const qack = createAudio(qackSrc, { volume: 0.2 });

	const web3 = getContext<ReturnType<typeof createWeb3Ctx>>("web3");
	const usd = web3.usdPrice;

	let numPixelBase = 4;
	$: numPixels = numPixelBase ** 2;

	$: pixels = Array(numPixels)
		.fill(1)
		.map(() => [EMPTY]);

	function clear() {
		pixels = Array(numPixels)
			.fill(1)
			.map(() => [EMPTY]);
	}

	const click = createAudio(clickSrc, { volume: 0.6 });

	$: {
		numPixels && 1;
		click.currentTime = 0;
		if (click.paused) {
			click.play();
		}
	}

	let conjuring = false;
	async function conjure() {
		clear();
		conjuring = true;

		let conjured: number[][];
		try {
			const [c, a] = await web3.conjure(numPixels);
			conjured = c.map((id) => decodePixel(id));
			if (a > 0n) {
				alert(`Congratualations, you found ${formatEther(a)} eth!`); // TODO: make this more fancy
			}
		} catch (err) {
			console.error(err);
			conjuring = false;
			return;
		}

		createAudio(sparkleSrc, {
			autoPlay: true,
			volume: 0.08,
			playbackRate: 1.5,
			disposable: true,
		});

		const steps = numPixels;
		for (let i = 0; i < steps; i++) {
			if (i >= 0) {
				pixels[i] = conjured[i];
				pixels = [...pixels];
				qack.play();
			}
			if (i < steps - 1) {
				await new Promise((r) => setTimeout(r, 400 / numPixels));
			} else {
				conjuring = false;
			}
		}
	}

	$: ethPrice = PIXEL_PRICE * numPixels;

	let container: HTMLDivElement;

	let lastNumPixels = 0;
	beforeUpdate(() => {
		if (!container || numPixels == lastNumPixels) return;
		for (const el of container.children) {
			el.getAnimations().forEach((a) => a.cancel());
		}
	});

	afterUpdate(() => {
		if (!container || numPixels == lastNumPixels) return;
		lastNumPixels = numPixels;
		for (const el of container.children) {
			const CHANGE = 1.4;
			let currDeg = rndBtwn(-CHANGE, CHANGE);
			let currPos = rndBtwn(-CHANGE, CHANGE);
			const anim = () => {
				const deg = rndBtwn(-CHANGE, CHANGE);
				const pos = currPos > 0 ? -CHANGE : CHANGE;
				el.animate(
					[
						{ transform: `translate(0, ${currPos}px) rotate(${currDeg}deg)` },
						{ transform: `translate(0, ${pos}px) rotate(${deg}deg)` },
					],
					{
						duration: rndBtwn(2000, 4000),
						iterations: 1,
						easing: "ease-in-out",
					}
				).onfinish = anim;
				currDeg = deg;
				currPos = pos;
			};
			anim();
		}
	});
</script>

<div class="grid grid-rows-[1fr,min-content,min-content] pb-8">
	<div class="grid m-auto">
		<div
			class="grid gap-2 mx-auto"
			bind:this={container}
			style="grid-template-columns: repeat({Math.floor(
				Math.sqrt(numPixels)
			)},1fr);"
		>
			{#each pixels as pxl, i (i)}
				<div class="border-2">
					{#if pxl[0] == EMPTY}
						<div
							class="h-6 w-6 text-center text-lg/6 align-baseline select-none"
						>
							?
						</div>
					{:else}
						<div class="grid" use:tooltip={fullPixelName(pxl)}>
							<Pixel class="h-6 w-6 pointer-events-none" pixel={pxl} />
						</div>
					{/if}
				</div>
			{/each}
		</div>

		<div class="mt-4 mx-auto grid">
			<PixelizedButton
				class="text-lg"
				action={conjure}
				options={{ active: true, colored: true }}
			>
				<span slot="default">Conjure pixels</span>
				<span slot="executing">Conjuring...</span>
			</PixelizedButton>
		</div>
	</div>

	<div
		class={`grid mt-auto ${
			conjuring && "pointer-events-none select-none opacity-40"
		}`}
	>
		<div class="flex mx-auto">
			<div>{ethPrice.toFixed(2)}mnt</div>
			<span>&ensp;=&ensp;</span>
			<span use:tooltip={`1mnt = $${$usd.toFixed(2)}`}
				>${(ethPrice * $usd).toFixed(2)}</span
			>
			<span>&ensp;=&ensp;</span>
			<span>{numPixels} pixels</span>
		</div>
	</div>

	<div
		class={`flex mx-auto space-x-4 mb-4 ${
			conjuring && "pointer-events-none select-none opacity-40"
		}`}
	>
		<input
			class="block my-auto ml-auto"
			type="range"
			min="4"
			max="12"
			step="2"
			bind:value={numPixelBase}
		/>
		<div class="text-lg w-6">
			x{numPixelBase}
		</div>
	</div>
</div>
