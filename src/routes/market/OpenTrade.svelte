<script lang="ts">
	import { getContext } from "svelte";
	import type { createRoutingCtx } from "../../contexts/routing";
	import type { createWeb3Ctx } from "../../contexts/web3";
	import { fullPixelName } from "../../helpers/color-utils";
	import { tooltip } from "../../directives/tooltip";
	import Pxl from "../../elements/Pixel.svelte";
	import PixelPalette from "../../elements/PixelPalette.svelte";
	import { parseEther, type Address } from "viem";
	import PixelizedButton from "../../elements/PixelizedButton.svelte";
	import {
		decodePixel,
		encodePixel,
	} from "../../../contracts/scripts/libraries/pixel-parser";
	import PixelSelector from "../../elements/PixelSelector.svelte";

	const web3 = getContext<ReturnType<typeof createWeb3Ctx>>("web3");
	const acc = web3.account;
	const pixels = web3.pixels;

	let selectedPixels: PixelId[] = [];

	$: selectedPixelsArr = selectedPixels.map((id) => decodePixel(id));

	$: pixelsArr = $pixels.toArray();

	$: availablePixels = pixelsArr.reduce(
		(state, id) => {
			const idx = state.toSub.indexOf(id);
			if (idx >= 0) {
				state.toSub.splice(idx, 1);
			} else {
				state.res.push(decodePixel(id));
			}
			return state;
		},
		{ toSub: selectedPixels.filter((id) => id), res: [] as Pixel[] }
	).res;

	const routing = getContext<ReturnType<typeof createRoutingCtx>>("routing");

	let selecting = true;

	let tradeType = 1;

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

	function select(pxl: PixelId) {
		selectedPixels = [...selectedPixels, pxl];
	}

	function deselect(pxl: PixelId) {
		selectedPixels.splice(
			selectedPixels.findIndex((id) => id === pxl),
			1
		);
		selectedPixels = [...selectedPixels];
	}

	async function openTrade() {
		selecting = false;
		const id = await web3.openTrade(
			selectedPixels,
			(receiver || import.meta.env.VITE_NULL_ADDR) as Address,
			parseEther(price),
			tradeType
		);
		routing.goto("trade", { id: id.substring(2) }, "market");
	}
</script>

<div class="m-auto grid gap-2">
	<div class="flex">
		<button class="button" on:click={() => routing.goback()}>go back</button>

		<select class="ml-auto" bind:value={tradeType}>
			<option value={0}>Sell</option>
			<option value={1}>Buy</option>
		</select>
	</div>

	<div class="border-2 p-4 grid gap-2">
		{#if tradeType == 0}
			<div class="grid">
				<div>Seller (You)</div>
				<div class="text-base/5">{$acc}</div>
			</div>
			<div class="grid">
				<div>Receiver (optional)</div>
				<input
					placeholder={import.meta.env.VITE_NULL_ADDR}
					class="border-2 bg-transparent outline-none text-base/5 px-1 w-full"
					bind:value={receiver}
				/>
			</div>
		{/if}
		{#if tradeType == 1}
			<div class="grid">
				<div>Buyer (You)</div>
				<div class="text-base/5">{$acc}</div>
			</div>
			<div class="grid">
				<div>Receiver (optional)</div>
				<input
					placeholder={import.meta.env.VITE_NULL_ADDR}
					class="border-2 bg-transparent outline-none text-base/5 px-1 w-full"
					bind:value={receiver}
				/>
			</div>
		{/if}

		<div class="grid">
			<div>Price ({import.meta.env.VITE_VALUE_SYMBOL})</div>
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
				{#each selectedPixelsArr as pxl}
					<div class="relative">
						<Pxl class="h-6 w-6" pixel={pxl} />
						<button
							class="absolute inset-0"
							use:tooltip={fullPixelName(pxl)}
							on:click={() => deselect(encodePixel(pxl))}
						/>
					</div>
				{/each}
			</div>
		</div>
	</div>

	{#if tradeType == 0}
		<PixelPalette
			pixels={availablePixels}
			cols={6}
			on:mousedown={(e) => select(encodePixel(e.detail.pxl))}
			class="absolute -translate-x-44 translate-y-8 {!selecting &&
				'opacity-0 pointer-events-none'}"
		/>
	{/if}

	{#if tradeType == 1}
		<PixelSelector
			cols={6}
			on:mousedown={(e) => select(encodePixel(e.detail.pxl))}
			class="absolute -translate-x-44 translate-y-8 {!selecting &&
				'opacity-0 pointer-events-none'}"
		/>
	{/if}

	<PixelizedButton
		class="ml-auto"
		disabled={selectedPixels.length == 0 || ether === null}
		action={openTrade}
	>
		<span slot="default">Open Trade</span>
		<span slot="executing">Opening Trade...</span>
	</PixelizedButton>
</div>
