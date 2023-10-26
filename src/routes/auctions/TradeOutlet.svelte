<script lang="ts">
	import { getContext } from "svelte";
	import type { P2PTrade, createWeb3Ctx } from "../../contexts/web3";
	import type { createRoutingCtx } from "../../contexts/routing";
	import Trade from "./Trade.svelte";

	const web3 = getContext<ReturnType<typeof createWeb3Ctx>>("web3");

	const routing = getContext<ReturnType<typeof createRoutingCtx>>("routing");
	const param = routing.param;

	let trade: undefined | null | P2PTrade = undefined;

	async function fetchTrade() {
		trade = await web3.getTrade(`0x${$param!.id}`);
	}

	$: {
		$param && fetchTrade();
	}
</script>

<div>
	<button class="button mb-2" on:click={() => routing.goback()}>go back</button>

	{#if trade === undefined}
		<div class="border-2 p-4">Fetching trade...</div>
	{/if}

	{#if trade === null}
		<div class="border-2 p-4">This trade does not exists</div>
	{/if}

	{#if trade}
		<Trade {trade} />
	{/if}
</div>
