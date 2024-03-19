<script lang="ts">
	import { getContext } from "svelte";
	import type { createWeb3Ctx } from "../contexts/web3";
	import { tooltip } from "../directives/tooltip";

	const web3 = getContext<ReturnType<typeof createWeb3Ctx>>("web3");
	const pixels = web3.pixels;
	const chain = web3.chain;
	const acc = web3.account;

	$: info =
		"Connected" +
		($pixels
			? `\nLast state: #${localStorage.getItem(`pixels_last_block_${$chain?.tag}_${$acc}`)}\nRight click to reset`
			: "");

	function reset() {
		Object.keys(localStorage).forEach((key) => {
			if (key.startsWith("pixels_")) {
				localStorage.removeItem(key);
			}
		});
		window.location.reload();
	}
</script>

{#if $acc}
	<div
		class="absolute w-2 h-2 bottom-4 right-4 overflow-visible"
		use:tooltip={info}
		on:contextmenu={(e) => {
			e.preventDefault();
			reset();
		}}
	>
		<div
			class="bg-green-500 h-1.5 w-1.5 absolute ml-px mt-px pointer-events-none"
		/>
		<div
			class="bg-green-500 h-2 w-2 animate-ping pointer-events-none opacity-70"
		/>
	</div>
{:else}
	<div
		class="absolute w-2 h-2 bottom-4 right-4 overflow-visible"
		use:tooltip={"Not connected"}
	>
		<div
			class="bg-red-500/50 h-1.5 w-1.5 absolute ml-px mt-px pointer-events-none"
		/>
	</div>
{/if}
