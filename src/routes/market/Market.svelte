<script lang="ts">
	import { tooltip } from "../../directives/tooltip";
	import Trades from "./Trades.svelte";

	let view: "search" | "trades" = "trades";
</script>

<div class="grid grid-rows-[min-content,1fr] m-auto gap-4">
	<div class="flex justify-around">
		<button
			class="opacity-50 {view == 'search' && 'underline'}"
			use:tooltip={"Coming soon!"}>Auction House</button
		>
		<button
			class="button {view == 'trades' && 'underline'}"
			on:click={() => (view = "trades")}>P2P Trades</button
		>
	</div>

	{#if view == "trades"}
		<Trades />
	{/if}
</div>
