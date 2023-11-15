<script lang="ts">
	import { getContext } from "svelte";
	import type { createWeb3Ctx } from "../../contexts/web3";
	import type { createRoutingCtx } from "../../contexts/routing";
	import type { createToastCtx } from "../../contexts/toast";
	import { formatEther, type Hex } from "viem";
	import PixelizedButton from "../../elements/PixelizedButton.svelte";
	import Trade from "./Trade.svelte";

	import { createAudio } from "../../helpers/audio";
	import sparkleSrc from "../../assets/sounds/sparkle.mp3";

	const toast = getContext<ReturnType<typeof createToastCtx>>("toast");

	const web3 = getContext<ReturnType<typeof createWeb3Ctx>>("web3");
	const acc = web3.account;
	const trades = web3.trades;

	const routing = getContext<ReturnType<typeof createRoutingCtx>>("routing");
	const param = routing.param;

	let trade: undefined | null | P2PTrade = undefined;

	$: isOwnTrade = trade?.creator.toLowerCase() == $acc?.toLowerCase();

	$: {
		if ($param?.id) {
			const id = `0x${$param!.id}` as Hex;
			const t = $trades.find((t) => t.id == id);
			if (t) {
				trade = t;
			} else {
				web3.getTrade(id).then((t) => (trade = t));
			}
		} else {
			trade = null;
		}
	}

	async function closeTrade() {
		try {
			await web3.closeTrade(trade!);
			routing.goto("treasury", { view: "pixels" }, "treasury");
			createAudio(sparkleSrc, {
				autoPlay: true,
				volume: 0.08,
				disposable: true,
			});
			toast.show(
				`You successfully closed a ${
					trade!.tradeType === 0 ? "sell" : "buy"
				} trade for ${formatEther(trade!.price)} ${
					import.meta.env.VITE_VALUE_SYMBOL
				}.`
			);
		} catch (err) {
			console.log(err);
		}
	}

	async function cancelTrade() {
		await web3.cancelTrade(trade!);
		routing.goback();
		toast.show(
			`You successfully canceled your trade\n restoring ${
				trade!.tradeType == 0 ? trade!.pixels.length : formatEther(trade!.price)
			} ${
				trade!.tradeType == 0 ? "pixels" : import.meta.env.VITE_VALUE_SYMBOL
			}.`
		);
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

		<PixelizedButton
			action={isOwnTrade ? cancelTrade : closeTrade}
			class={isOwnTrade ? "mr-auto" : "ml-auto"}
			options={{ colored: !isOwnTrade }}
		>
			<span slot="default">{isOwnTrade ? "Cancel" : "Close"} Trade</span>
			<span slot="executing"
				>{isOwnTrade ? "Canceling" : "Closing"} Trade...</span
			>
		</PixelizedButton>
	{/if}
</div>
