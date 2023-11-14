<script lang="ts">
	import { getContext } from "svelte";
	import type { createWeb3Ctx } from "../../contexts/web3";
	import type { createRoutingCtx } from "../../contexts/routing";
	import Trade from "./Trade.svelte";

	const web3 = getContext<ReturnType<typeof createWeb3Ctx>>("web3");
	const acc = web3.account;
	const trades = web3.trades;

	const routing = getContext<ReturnType<typeof createRoutingCtx>>("routing");

	let filter = 0;

	$: filteredTrades = $trades.filter((t) => {
		switch (filter) {
			case 0:
				return true;
			case 1:
				return t.creator == $acc?.toLowerCase();
			case 2:
				return t.receiver == $acc?.toLowerCase();
		}
	});
</script>

<div class="grid gap-2">
	<div
		class="border-2 grid gap-4 p-4 overflow-y-auto max-h-[60vh] min-w-[22.5rem]"
	>
		{#if $trades === null}
			<div class=" text-center text-xs opacity-60 left-0 right-0">
				Fetching trades...
			</div>
		{/if}

		{#if filteredTrades.length === 0}
			<div class=" text-center text-xs opacity-60 left-0 right-0">
				No trades
			</div>
		{/if}

		{#each filteredTrades as trade}
			<button
				on:click={() => routing.goto("trade", { id: trade.id.substring(2) })}
				class="group"
			>
				<Trade {trade} class="group-hover:scale-95" />
			</button>
		{/each}
	</div>

	<div class="flex justify-between">
		<select bind:value={filter}>
			<option value={0}>All Trades</option>
			<option value={1}>By You</option>
			<option value={2}>For You</option>
		</select>

		<button class="button" on:click={() => routing.goto("opentrade")}>
			Open Trade
		</button>
	</div>
</div>
