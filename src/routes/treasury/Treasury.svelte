<script lang="ts">
	import Pixels from "./Pixels.svelte";
	import Plates from "./Plates.svelte";

	let view: "pixels" | "plates" = "plates";
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
