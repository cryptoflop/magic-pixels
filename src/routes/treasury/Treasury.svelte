<script lang="ts">
	import { getContext } from "svelte";
	import Pixels from "./Pixels.svelte";
	import Plates from "./Plates.svelte";
	import type { createRoutingCtx } from "../../contexts/routing";

	const routing = getContext<ReturnType<typeof createRoutingCtx>>("routing");
	const params = routing.params;

	let view: "pixels" | "plates" = ($params?.view as "pixels") ?? "plates";
</script>

<div class="grid grid-rows-[min-content,1fr] m-auto gap-4">
	<div class="flex justify-around">
		<button
			class="button {view == 'pixels' && 'underline'}"
			on:click={() => (view = "pixels")}>Pixels</button
		>
		<button
			class="button {view == 'plates' && 'underline'}"
			on:click={() => (view = "plates")}>Plates</button
		>
	</div>

	{#if view == "pixels"}
		<Pixels />
	{/if}
	{#if view == "plates"}
		<Plates />
	{/if}
</div>
