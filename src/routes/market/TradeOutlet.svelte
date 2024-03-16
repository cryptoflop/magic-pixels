<script lang="ts">
	import { getContext } from "svelte";
	import type { createWeb3Ctx } from "../../contexts/web3";
	import type { createRoutingCtx } from "../../contexts/routing";
	import type { createToastCtx } from "../../contexts/toast";
	import { formatEther, zeroAddress, type Hex } from "viem";
	import PixelizedButton from "../../elements/PixelizedButton.svelte";
	import Trade from "./Trade.svelte";

	import { createAudio } from "../../helpers/audio";
	import sparkleSrc from "../../assets/sounds/sparkle.mp3";
	import { tooltip } from "../../directives/tooltip";

	const toast = getContext<ReturnType<typeof createToastCtx>>("toast");

	const web3 = getContext<ReturnType<typeof createWeb3Ctx>>("web3");
	const chain = web3.chain;
	const acc = web3.account;
	const pixels = web3.pixels;
	const trades = web3.trades;

	const routing = getContext<ReturnType<typeof createRoutingCtx>>("routing");
	const params = routing.params;

	let trade: undefined | null | P2PTrade = undefined;

	$: isOwnTrade = trade?.creator.toLowerCase() == $acc?.toLowerCase();

	let cannotCloseReason: string | null = null;

	$: {
		if ($chain) {
			if (!trade || isOwnTrade) {
				cannotCloseReason = null;
			} else {
				if (
					trade.receiver !== zeroAddress &&
					trade.receiver.toLowerCase() !== $acc?.toLowerCase()
				) {
					cannotCloseReason = "You are not the trade receiver.";
				} else {
					if (trade.tradeType == 0) {
						web3.getBalance().then((balance) => {
							cannotCloseReason =
								balance > trade!.price ? null : "Insufficient funds.";
						});
					} else {
						cannotCloseReason = $pixels.has(trade.pixels)
							? null
							: "Insufficient pixels.";
					}
				}
			}
		}
	}

	$: {
		if ($params?.id) {
			const id = `0x${$params!.id}` as Hex;
			const t = $trades.find((t) => t.id == id);
			if (t) {
				trade = t;
			} else {
				web3.getTrade(id)
				.then((t) => (trade = t))
				.catch(() => trade = null);
			}
		} else {
			trade = null;
		}
	}

	async function closeTrade() {
		try {
			await web3.closeTrade(trade!);
			routing.goto("treasury", undefined, { view: "pixels" });
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
				}.`,
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
			}.`,
		);
	}
</script>

<div class="m-auto grid gap-2">
	<div class="flex justify-between">
		<button class="button mr-auto" on:click={() => routing.goback()}>
			go back
		</button>

		{#if trade}
			<button
				class="button pointer-events-auto"
				use:tooltip={"Copy the link to this trade."}
				on:click|stopPropagation={() =>
					navigator.clipboard.writeText(
						`${window.location.origin}?root=market&route=trade&chain=${$chain?.tag}&id=${trade?.id.substring(2)}`,
					)}
			>
				Share
			</button>
		{/if}
	</div>

	{#if trade === undefined}
		<div class="border-2 p-4">Fetching trade...</div>
	{/if}

	{#if trade === null}
		<div class="border-2 p-4">This trade does not exists</div>
	{/if}

	{#if trade}
		<Trade {trade} />

		{#if $acc}
			<div class="{isOwnTrade ? 'mr-auto' : 'ml-auto'} relative">
				<PixelizedButton
					action={isOwnTrade ? cancelTrade : closeTrade}
					options={{ colored: !isOwnTrade }}
					disabled={!!cannotCloseReason}
				>
					<span slot="default">{isOwnTrade ? "Cancel" : "Close"} Trade</span>
					<span slot="executing"
						>{isOwnTrade ? "Canceling" : "Closing"} Trade...</span
					>
				</PixelizedButton>

				{#if cannotCloseReason}
					<div class="absolute inset-0" use:tooltip={cannotCloseReason} />
				{/if}
			</div>
		{/if}
	{/if}
</div>
