<script lang="ts">
	import { getContext } from "svelte";
	import type { createWeb3Ctx } from "../../contexts/web3";
	import type { createRoutingCtx } from "../../contexts/routing";
	import Trade from "./Trade.svelte";

	const web3 = getContext<ReturnType<typeof createWeb3Ctx>>("web3");
	const trades = web3.trades;

	const routing = getContext<ReturnType<typeof createRoutingCtx>>("routing");
</script>

<div class="grid gap-2">
	<div
		class="border-2 grid gap-4 p-4 overflow-y-auto max-h-[60vh] min-w-[22.5rem]"
	>
		{#if !$trades.length}
			<div class=" text-center text-xs opacity-60 left-0 right-0">
				No trades
			</div>
		{/if}

		{#each $trades as trade}
			<div class="hover:bg-white/10" on:click={(e) => console.log(e)}>
				<Trade {trade} />
			</div>
		{/each}
	</div>

	<div class="flex justify-end">
		<button class="button" on:click={() => routing.goto("opentrade")}>
			Open Trade
		</button>
	</div>
</div>
