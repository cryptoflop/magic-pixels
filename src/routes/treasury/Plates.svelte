<script lang="ts">
	import Plate from "../../elements/Plate.svelte";
	import { getContext } from "svelte";
	import type { createWeb3Ctx } from "../../contexts/web3";

	const web3 = getContext<ReturnType<typeof createWeb3Ctx>>("web3");
	const plates = web3.plates;
</script>

<div
	class="border-2 grid grid-cols-2 gap-4 p-4 overflow-y-auto h-[314px] max-h-[314px]"
	style="grid-auto-rows: min-content;"
>
	{#each $plates as plate}
		<div class="group cursor-pointer">
			<div class="border-2 group-hover:scale-95">
				<div class="px-1.5 flex justify-between">
					<div>#{plate.id}</div>
					<div class="text-xs mt-[5px]">
						{`${Math.sqrt(plate.pixels.length)}x${Math.sqrt(
							plate.pixels.length
						)}`}
					</div>
				</div>
				<Plate class="w-36" {plate} />
			</div>
		</div>
	{/each}

	{#if $plates.length == 0}
		<div class="text-xs opacity-60 absolute w-64 text-center p-4 ml-2">
			No plates
		</div>
		<div class="w-36" />
	{/if}
</div>
