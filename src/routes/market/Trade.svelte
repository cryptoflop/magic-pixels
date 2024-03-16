<script lang="ts">
	import { getContext } from "svelte";
	import type { createWeb3Ctx } from "../../contexts/web3";
	import { fullPixelName } from "../../helpers/color-utils";
	import Pixel from "../../elements/Pixel.svelte";
	import { tooltip } from "../../directives/tooltip";
	import { formatEther, zeroAddress } from "viem";
	import { decodePixel } from "../../../contracts/scripts/libraries/pixel-parser";

	const web3 = getContext<ReturnType<typeof createWeb3Ctx>>("web3");
	const chain = web3.chain;
	const acc = web3.account;

	export let trade: P2PTrade;

	$: pixels = trade?.pixels?.map((id) => decodePixel(id)) ?? [];

	let className = "";
	export { className as class };

	const formatAcc = (acc: string) =>
		acc.toLocaleLowerCase() === $acc?.toLowerCase()
			? "You"
			: acc.substring(0, 6) + "..";
</script>

<div class="grid border-2 p-4 pointer-events-none {className}">
	<div class="-mt-1.5 flex">
		<div class="grid">
			<div class="mr-auto">
				{trade.tradeType == 0 ? "Seller" : "Buyer"}:
				{formatAcc(trade.creator)}
			</div>
			<div class="{trade.receiver == zeroAddress && 'opacity-30'} mr-auto">
				{trade.tradeType == 0 ? "Buyer" : "Seller"}:
				{formatAcc(trade.receiver)}
			</div>
		</div>

		<div class="grid ml-auto">
			<div class="relative">
				Price: {formatEther(trade.price)}
				{$chain?.symbol}
				<div class="absolute text-xs right-0 top-5 opacity-50">0.10% fee</div>
			</div>
		</div>
	</div>

	<div class="mr-auto">Pixels:</div>
	<div class="grid grid-cols-[repeat(12,1fr)] border-2 pointer-events-auto">
		{#each pixels as pxl}
			<div class="relative cursor-default" on:click|stopPropagation>
				<Pixel class="h-6 w-6" pixel={pxl} />
				<div class="absolute inset-0" use:tooltip={fullPixelName(pxl)} />
			</div>
		{/each}
	</div>
</div>
