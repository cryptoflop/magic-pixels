<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import { tooltip } from "../directives/tooltip";
	import { MAX_PIXEL, pixelColor, pixelName } from "../helpers/color-utils";

	const dispatch = createEventDispatcher();

	let className = "";
	export { className as class };

	let selectedExtern: { [key: number]: boolean } = {};
	export { selectedExtern as selected };

	let selected: { [key: number]: boolean } = { ...selectedExtern };

	function select(idx: number) {
		if (selected[idx]) {
			delete selected[idx];
		} else {
			selected[idx] = true;
		}
		selected = { ...selected };
	}

	function done() {
		dispatch("select", {
			selected,
		});
	}

	let indicies = Array(MAX_PIXEL - 2)
		.fill(1)
		.map((_, i) => i + 1);
</script>

<div class="absolute border-2 {className}">
	<div class="grid grid-cols-9">
		{#each indicies as i}
			<button
				on:mousedown={() => select(i)}
				class="h-5 w-5 border-hover-blackandwhite {selected[i] &&
					'border-blackandwhite'}"
				use:tooltip={pixelName(i)}
				style="background-color: {pixelColor(i)}"
			/>
		{/each}
	</div>
	<div class="grid grid-cols-2">
		<button
			on:mousedown={() => select(190)}
			class="h-5 border-hover-blackandwhite {selected[190] &&
				'border-blackandwhite'}"
			use:tooltip={pixelName(190)}
			style="background-color: {pixelColor(190)}"
		/>
		<button
			on:mousedown={() => select(191)}
			class="h-5 border-hover-blackandwhite {selected[191] &&
				'border-blackandwhite'}"
			use:tooltip={pixelName(191)}
			style="background-color: {pixelColor(191)}"
		/>
	</div>

	<div class="flex mx-2">
		<div>Selected: {Object.keys(selected).length}</div>
		<div class="mr-auto">
			&ensp;(<span on:click={() => (selected = {})} class="button">Clear</span>)
		</div>

		<button class="button" on:click={done}>Ok</button>
	</div>
</div>
