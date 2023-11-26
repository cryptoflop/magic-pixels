<script lang="ts">
	import { afterUpdate, beforeUpdate, getContext } from "svelte";
	import Pxl from "../elements/Pixel.svelte";
	import PixelizedButton from "../elements/PixelizedButton.svelte";
	import { tooltip } from "../directives/tooltip";
	import { fullPixelName } from "../helpers/color-utils";
	import { rndBtwn } from "../helpers/utils";
	import type { createWeb3Ctx } from "../contexts/web3";
	import { formatEther } from "viem";

	import qackSrc from "../assets/sounds/quack.mp3";
	import clickSrc from "../assets/sounds/click.mp3";
	import sparkleSrc from "../assets/sounds/sparkle.mp3";
	import winSrc from "../assets/sounds/win.mp3";
	import { createAudio } from "../helpers/audio";
	import { decodePixel } from "../../contracts/scripts/libraries/pixel-parser";
	import { createToastCtx } from "../contexts/toast";
	import UnexpectedFind from "../elements/UnexpectedFind.svelte";

	const toast = getContext<ReturnType<typeof createToastCtx>>("toast");

	const web3 = getContext<ReturnType<typeof createWeb3Ctx>>("web3");
	const usd = web3.usdPrice;
	const pixelPrice = web3.price;

	let numPixelBase = 4;
	$: numPixels = numPixelBase ** 2;

	$: pixels = Array(numPixels)
		.fill(1)
		.map(() => [] as Pixel);

	function clear() {
		pixels = Array(numPixels)
			.fill(1)
			.map(() => []);
	}

	const qack = createAudio(qackSrc, { volume: 0.2 });
	const click = createAudio(clickSrc, { volume: 0.1 });

	$: {
		numPixels && false;
		click.currentTime = 0;
		if (click.paused ?? true) {
			click.play();
		}
	}

	let conjuring = false;
	async function conjure() {
		clear();
		conjuring = true;

		let conjured: Pixel[];
		let surpriseFindAmount: bigint;
		try {
			const [c, a] = await web3.conjure(numPixels);
			conjured = c.map((id) => decodePixel(id));
			surpriseFindAmount = a;
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
				if (surpriseFindAmount > 0n) {
					setTimeout(() => {
						createAudio(winSrc, {
							autoPlay: true,
							volume: 0.2,
							disposable: true,
						});

						toast.show(UnexpectedFind, {
							amount: formatEther(surpriseFindAmount),
						});
					}, 2000);
				}
			}
		}
	}

	$: price = $pixelPrice * numPixels;

	const fPrice = (raw: string | number) => {
		const s = raw.toString().split(".");
		if (!s[1]) return raw;
		return (
			s[0] +
			"." +
			s[1].substring(0, Array.from(s[1]).findIndex((c) => c !== "0") + 1)
		);
	};

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
					},
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
				Math.sqrt(numPixels),
			)},1fr);"
		>
			{#each pixels as pxl, i (i)}
				<div class="border-2">
					{#if !pxl[0]}
						<div
							class="h-6 w-6 text-center text-lg/6 align-baseline select-none"
						>
							?
						</div>
					{:else}
						<div class="grid" use:tooltip={fullPixelName(pxl)}>
							<Pxl class="h-6 w-6 pointer-events-none" pixel={pxl} />
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
			<span
				use:tooltip={`1 pixel = ${fPrice($pixelPrice)} ${
					import.meta.env.VITE_VALUE_SYMBOL
				}`}>{numPixels} pixels</span
			>
			<span>&ensp;=&ensp;</span>
			<div>{fPrice(price)} {import.meta.env.VITE_VALUE_SYMBOL}</div>
			<span>&ensp;=&ensp;</span>
			<span
				use:tooltip={`1 ${import.meta.env.VITE_VALUE_SYMBOL} = $${$usd.toFixed(
					2,
				)}`}>${fPrice(price * $usd)}</span
			>
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
