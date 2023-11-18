<script lang="ts">
	import Plt from "../../elements/Plate.svelte";
	import { getContext } from "svelte";
	import type { createWeb3Ctx } from "../../contexts/web3";
	import type { createRoutingCtx } from "../../contexts/routing";

	const routing = getContext<ReturnType<typeof createRoutingCtx>>("routing");

	const web3 = getContext<ReturnType<typeof createWeb3Ctx>>("web3");
	const plates = web3.plates;

	const plateSize = (plate: Plate) => {
		const s = Math.sqrt(plate.pixels.length);
		return s + "x" + s;
	};
</script>

<div
	class="border-2 grid grid-cols-2 gap-4 p-4 overflow-y-auto h-[388px] max-h-[388px]"
	style="grid-auto-rows: min-content;"
>
	{#each $plates as plate}
		<button
			class="group cursor-pointer"
			on:click={() =>
				routing.goto("treasury", "plate", { id: plate.id.toString() })}
		>
			<div class="border-2 group-hover:scale-95 pointer-events-none">
				<div class="px-1.5 flex justify-between">
					<div>{plate.name}</div>
					<div class="text-xs mt-[5px]">{plateSize(plate)}</div>
				</div>
				<Plt class="w-36" {plate} />
			</div>
		</button>
	{/each}

	{#if $plates.length == 0}
		<div class="text-xs opacity-60 absolute w-[18.5rem] text-center p-4 ml-2">
			No plates
		</div>
		<div class="w-[9.25rem]" />
	{/if}
</div>
