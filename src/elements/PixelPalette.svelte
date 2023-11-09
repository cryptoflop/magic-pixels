<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import { tooltip } from "../directives/tooltip";
	import { fullPixelName } from "../helpers/color-utils";
	import Pxl from "./Pixel.svelte";
	import PixelFilter from "./PixelFilter.svelte";
	import VirtualList from "./VirtualList.svelte";

	const dispatch = createEventDispatcher();

	let className = "";
	export { className as class };

	let classNamePixel = "";
	export { classNamePixel as classPixel };

	let filterOpen = false;
	let filter: { [key: number]: boolean } = {};
	$: filterLength = Object.keys(filter).length;

	export let cols = 4;

	export let pixels: Pixel[] = [];

	$: availablePixels = pixels
		.filter((pxl) => (filterLength ? pxl.some((i) => filter[i]) : true)) // removed filtered pixels
		.sort((a, b) => a[0] - b[0]); // sort by color (number asc)

	export let filtered = availablePixels;
	$: {
		filtered = availablePixels;
	}

	$: pixelRows = Array(Math.ceil(availablePixels.length / cols))
		.fill(1)
		.map((_, r) =>
			Array(cols)
				.fill(1)
				.map((_, i) => availablePixels[r * cols + i])
				.filter((p) => !!p)
		);
</script>

<div class="border-2 {className}">
	{#if filterOpen}
		<div class="absolute -mt-[2px] -ml-[2px] w-48 overflow-visible z-10">
			<div class="relative">
				<PixelFilter
					class="bg-black"
					selected={filter}
					on:onselect={(v) => {
						filterOpen = false;
						filter = v.detail.selected;
					}}
				/>
			</div>
		</div>
	{/if}

	<div class="flex">
		<button
			class="mr-auto ml-2 mt-[4px] mb-[4px] button"
			on:click={() => (filterOpen = true)}>Filter</button
		>
		<div class="text-xs mt-2 mr-2">{filterLength} active</div>
	</div>

	<div class="relative h-[352px]">
		{#if availablePixels.length == 0}
			<div class="absolute text-center text-xs opacity-60 pl-2 left-0 right-0">
				No pixels
			</div>
		{/if}

		<div style="min-width: {cols * 24 + 8}px; height: 352px;">
			<VirtualList
				class="overflow-y-scroll"
				classRow="flex"
				itemHeight={24}
				items={pixelRows}
				let:item
			>
				{#each item as pxl}
					<div
						class="relative"
						on:mousedown={(e) => dispatch("mousedown", { pxl, ev: e })}
					>
						<Pxl class="h-6 w-6" pixel={pxl} />
						<div
							class="absolute inset-0 hover:bg-white/30 select-none {classNamePixel}"
							use:tooltip={fullPixelName(pxl)}
						/>
					</div>
				{/each}
			</VirtualList>
		</div>
	</div>
</div>
