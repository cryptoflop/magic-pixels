<script lang="ts">
	import Pixel from "../elements/Pixel.svelte";
	import { tooltip } from "../directives/tooltip";
	import { EMPTY, fullPixelName } from "../helpers/color-utils";
	import { rndBtwn } from "../helpers/utils";
	import { afterUpdate, beforeUpdate, getContext } from "svelte";
	import type { createWeb3Ctx } from "../contexts/web3";

	import qackSrc from "../assets/quack.mp3";
	import clickSrc from "../assets/click.mp3";
	import sparkleSrc from "../assets/sparkle.mp3";
	import { createAudio } from "../helpers/audio";
	import { BATCH_COST, BATCH_SIZE } from "../values";
	import { formatEther } from "viem";

	const qack = createAudio(qackSrc, { volume: 0.2 });

	const web3 = getContext<ReturnType<typeof createWeb3Ctx>>("web3");
	const usd = web3.usdPrice;

	$: pixels = Array(batches * BATCH_SIZE)
		.fill(1)
		.map(() => [EMPTY]);

	function clear() {
		pixels = Array(batches * BATCH_SIZE)
			.fill(1)
			.map(() => [EMPTY]);
	}

	let batches = 1;

	const click = createAudio(clickSrc, { volume: 0.6 });

	$: {
		batches && 1;
		click.currentTime = 0;
		if (click.paused) {
			click.play();
		}
	}

	let conjuring = false;
	async function conjure() {
		conjuring = true;

		let conjured: number[][];
		try {
			const [c, a] = await web3.conjure(batches);
			conjured = c;
			if (a > 0n) {
				alert(`Congratualations, you found ${formatEther(a)} eth!`); // TODO: make this more fancy
			}
		} catch {
			conjuring = false;
			return;
		}

		let i = -1;
		function step() {
			if (i >= 0) {
				pixels[i] = conjured[i];
				pixels = [...pixels];
				qack.play();
			}
			if (i < BATCH_SIZE * batches - 1) {
				setTimeout(step, 200 / batches);
			} else {
				conjuring = false;
			}
			i++;
		}
		step();

		createAudio(sparkleSrc, {
			autoPlay: true,
			volume: 0.08,
			playbackRate: 1.5,
			disposable: true,
		});
	}

	$: ethPrice = BATCH_COST * batches;

	let container: HTMLDivElement;

	let lastNumBatches = 0;
	beforeUpdate(() => {
		if (!container || batches == lastNumBatches) return;
		for (const el of container.children) {
			el.getAnimations().forEach((a) => a.cancel());
		}
	});

	afterUpdate(() => {
		if (!container || batches == lastNumBatches) return;
		lastNumBatches = batches;
		for (const el of container.children) {
			const CHANGE = 1.2;
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
			class="grid gap-1 mx-auto"
			bind:this={container}
			style="grid-template-columns: repeat({Math.floor(
				Math.sqrt(batches * BATCH_SIZE)
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

		<div class="mt-4 grid">
			{#if conjuring}
				<div class="select-none text-lg text-center">Conjuring...</div>
			{:else if pixels[BATCH_SIZE * batches - 1][0] != EMPTY}
				<button class="select-none text-lg button" on:click={clear}>Ok</button>
			{:else}
				<button on:click={conjure} class="select-none text-lg button"
					>Conjure pixels</button
				>
			{/if}
		</div>
	</div>

	<div
		class={`grid mt-auto ${
			conjuring && "pointer-events-none select-none opacity-40"
		}`}
	>
		<div class="flex mx-auto">
			<div>{ethPrice.toFixed(3)}eth</div>
			<span>&ensp;=&ensp;</span>
			<span use:tooltip={`1 eth = $${$usd.toFixed(2)}`}
				>${(ethPrice * $usd).toFixed(2)}</span
			>
			<span>&ensp;=&ensp;</span>
			<span>{batches * BATCH_SIZE} pixels</span>
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
			min="1"
			max="10"
			step="1"
			bind:value={batches}
		/>
		<div class="text-lg w-6">
			x{batches}
		</div>
	</div>
</div>
