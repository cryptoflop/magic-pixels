<script lang="ts">
	import { getContext } from "svelte";
	import type { P2PTrade, createWeb3Ctx } from "../../contexts/web3";
	import { fullPixelName } from "../../helpers/color-utils";
	import Pixel from "../../elements/Pixel.svelte";
	import { tooltip } from "../../directives/tooltip";
	import { NULL_ADDR } from "../../values";
	import { formatEther } from "viem";

	const web3 = getContext<ReturnType<typeof createWeb3Ctx>>("web3");
	const acc = web3.account;

	export let trade: P2PTrade;

	let className = "";
	export { className as class };
</script>

<div class="grid border-2 {className}">
	<div class="px-4 py-2.5 flex">
		<div class="grid">
			{#if trade.seller === $acc}
				<div>Seller: You</div>
				<div class="{trade.buyer == NULL_ADDR && 'opacity-30'} none">
					Buyer: {trade.buyer.substring(0, 5) + ".."}
				</div>
			{/if}
			{#if trade.seller !== $acc}
				<div>Buyer: You</div>
				<div class="{trade.seller == NULL_ADDR && 'opacity-30'} none">
					Seller: {trade.seller.substring(0, 5) + ".."}
				</div>
			{/if}
		</div>

		<div class="grid ml-auto place-items-end">
			<div class="">
				Price: {formatEther(trade.price)} eth
			</div>
			<button
				class="button"
				use:tooltip={"Copy the link to this trade."}
				on:click|stopPropagation={() =>
					navigator.clipboard.writeText(
						window.location.origin +
							"/auctions/trade?id=" +
							trade.id.substring(2)
					)}
			>
				Share
			</button>
		</div>
	</div>

	<div class="grid grid-cols-[repeat(12,1fr)] pt-0.5 p-4">
		{#each trade.pixels as pxl}
			<div class="relative cursor-default" on:click|stopPropagation>
				<Pixel class="h-6 w-6" pixel={pxl} />
				<div class="absolute inset-0" use:tooltip={fullPixelName(pxl)} />
			</div>
		{/each}
	</div>
</div>
