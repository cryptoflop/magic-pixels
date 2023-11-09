<script lang="ts">
	import { onMount } from "svelte";
	import { EMPTY, comparePixel, pixelizeElement } from "../helpers/color-utils";

	let className = "";
	export { className as class };

	export let pixel = [EMPTY];

	let el: HTMLDivElement;

	function update() {
		el?.getAnimations()[0]?.cancel();
		pixelizeElement(el, pixel);
	}

	let prev: Pixel;

	onMount(() => {
		prev = pixel;
		update();
	});

	$: {
		if (prev && el && !comparePixel(prev, pixel)) {
			update();
			prev = pixel;
		}
	}
</script>

<div class={className} bind:this={el} />
