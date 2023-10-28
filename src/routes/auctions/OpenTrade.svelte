<script lang="ts">
	import { getContext } from "svelte";
	import type { createRoutingCtx } from "../../contexts/routing";
	import type { createWeb3Ctx } from "../../contexts/web3";
	import { comparePixel, fullPixelName } from "../../helpers/color-utils";
	import { tooltip } from "../../directives/tooltip";
	import Pixel from "../../elements/Pixel.svelte";
	import PixelPalette from "../../elements/PixelPalette.svelte";
	import { NULL_ADDR } from "../../values";
	import { formatEther, parseEther } from "viem";
	import PixelizedButton from "../../elements/PixelizedButton.svelte";

	const web3 = getContext<ReturnType<typeof createWeb3Ctx>>("web3");
	const acc = web3.account;
	const pixels = web3.pixels;

	let selectedPixelIndices: number[] = [];

	$: availablePixels = $pixels.filter(
		(_, i) => selectedPixelIndices.findIndex((idx) => idx == i) == -1
	);

	$: selectedPixels = selectedPixelIndices.map((idx) => $pixels[idx]);

	const routing = getContext<ReturnType<typeof createRoutingCtx>>("routing");

	let selecting = false;

	let type: "sell" | "buy" = "sell";

	let price = "";

	let ether: BigInt | null = null;

	$: {
		try {
			if (price.length == 0) {
				throw "invalid length";
			}
			ether = parseEther(price);
		} catch (err) {
			ether = null;
		}
	}

	let receiver = "";

	function select(pxl: number[]) {
		const idx = $pixels.findIndex(
			(p, i) =>
				comparePixel(pxl, p) &&
				selectedPixelIndices.findIndex((idx) => idx == i) == -1
		);
		selectedPixelIndices = [...selectedPixelIndices, idx];
	}

	function deselect(pxl: number[]) {
		const idx = selectedPixelIndices.findIndex((idx) =>
			comparePixel(pxl, $pixels[idx])
		);
		selectedPixelIndices.splice(idx, 1);
		selectedPixelIndices = [...selectedPixelIndices];
	}

	async function openTrade() {
		selecting = false;
		await web3.openTrade(
			selectedPixels,
			parseEther(price),
			receiver || NULL_ADDR,
			type == "sell"
		);
		routing.goback();
	}
</script>

<div class="m-auto grid gap-2">
	<div class="flex">
		<button class="button" on:click={() => routing.goback()}>go back</button>

		<select class="ml-auto" bind:value={type}>
			<option value="sell">Sell</option>
			<option value="buy">Buy</option>
		</select>
	</div>

	<div class="border-2 p-4 grid gap-2">
		{#if type == "sell"}
			<div class="grid">
				<div>Seller (You)</div>
				<div class="text-base/5">{$acc}</div>
			</div>
			<div class="grid">
				<div>Receiver (optional)</div>
				<input
					placeholder={NULL_ADDR}
					class="border-2 bg-transparent outline-none text-base/5 px-1 w-full"
					bind:value={receiver}
				/>
			</div>
		{/if}
		{#if type == "buy"}
			<div class="grid">
				<div>Buyer (You)</div>
				<div class="text-base/5">{$acc}</div>
			</div>
			<div class="grid">
				<div>Receiver (optional)</div>
				<input
					placeholder={NULL_ADDR}
					class="border-2 bg-transparent outline-none text-base/5 px-1 w-full"
					bind:value={receiver}
				/>
			</div>
		{/if}

		<div class="grid">
			<div>Price (eth)</div>
			<input
				placeholder="0.00"
				class="border-2 bg-transparent outline-none text-base/5 px-1 mr-auto"
				bind:value={price}
			/>
		</div>
		<div class="grid">
			<div class="flex justify-between">
				Pixels
				<button class="button" on:click={() => (selecting = !selecting)}>
					Select
				</button>
			</div>
			<div
				class="border-2 grid grid-cols-[repeat(12,1fr)] min-h-[1.75rem] min-w-[18.25rem]"
			>
				{#each selectedPixels as pxl}
					<div class="relative">
						<Pixel class="h-6 w-6" pixel={pxl} />
						<div
							class="absolute inset-0"
							use:tooltip={fullPixelName(pxl)}
							on:click={() => deselect(pxl)}
						/>
					</div>
				{/each}
			</div>
		</div>
	</div>

	<PixelPalette
		pixels={availablePixels}
		cols={6}
		on:mousedown={(e) => select(e.detail.pxl)}
		class="absolute -translate-x-44 translate-y-8 {!selecting &&
			'opacity-0 pointer-events-none'}"
	/>

	<PixelizedButton
		class="ml-auto"
		disabled={selectedPixels.length == 0 || ether === null}
		action={openTrade}
	>
		<span slot="default">Open Trade</span>
		<span slot="executing">Opening Trade...</span>
	</PixelizedButton>
</div>
