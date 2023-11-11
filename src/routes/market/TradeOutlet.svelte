<script lang="ts">
	import { getContext } from "svelte";
	import type { createWeb3Ctx } from "../../contexts/web3";
	import type { createRoutingCtx } from "../../contexts/routing";
	import Trade from "./Trade.svelte";
	import PixelizedButton from "../../elements/PixelizedButton.svelte";
	import { tooltip } from "../../directives/tooltip";

	const web3 = getContext<ReturnType<typeof createWeb3Ctx>>("web3");
	const trades = web3.trades;

	const routing = getContext<ReturnType<typeof createRoutingCtx>>("routing");
	const param = routing.param;

	let trade: undefined | null | P2PTrade = undefined;

	let isOwnTrade = false;

	$: {
		if ($param?.id) {
			const ownTrade = $trades.find((t) => t.id == `0x${$param!.id}`);
			if (ownTrade) {
				isOwnTrade = true;
				trade = ownTrade;
			} else {
				isOwnTrade = false;
				web3.getTrade(`0x${$param!.id}`).then((t) => (trade = t));
			}
		} else {
			trade = null;
		}
	}

	async function closeTrade() {
		try {
			await web3.closeTrade(trade!);
		} catch (err) {
			console.log(err);
		}
	}
</script>

<div class="m-auto grid gap-2">
	<button class="button mr-auto" on:click={() => routing.goback()}
		>go back</button
	>

	{#if trade === undefined}
		<div class="border-2 p-4">Fetching trade...</div>
	{/if}

	{#if trade === null}
		<div class="border-2 p-4">This trade does not exists</div>
	{/if}

	{#if trade}
		<Trade {trade} />

		<div class="ml-auto relative">
			<PixelizedButton action={closeTrade} disabled={isOwnTrade}>
				<span slot="default">Close Trade</span>
				<span slot="executing">Closing Trade...</span>
			</PixelizedButton>

			{#if isOwnTrade}
				<div class="absolute inset-0" use:tooltip={"This is your own trade"} />
			{/if}
		</div>
	{/if}
</div>
