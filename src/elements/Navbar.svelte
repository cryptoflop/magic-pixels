<script lang="ts">
	import { getContext } from "svelte";
	import type { createRoutingCtx } from "../contexts/routing";

	const routing = getContext<ReturnType<typeof createRoutingCtx>>("routing");
	const root = routing.root;

	const views = ["Nether", "Forge", "Treasury", "Auctions"];
</script>

<div class="flex space-x-6 mx-auto select-none text-lg">
	{#each views as v}
		<button
			class="button {v.toLowerCase() == $root && 'underline'}"
			on:click={() =>
				v.toLowerCase() != $root &&
				routing.goto(v.toLowerCase(), undefined, true)}>{v}</button
		>
	{/each}
</div>
