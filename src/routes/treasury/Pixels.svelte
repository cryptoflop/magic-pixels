<script lang="ts">
	import PixelPalette from "../../elements/PixelPalette.svelte";
	import { getContext } from "svelte";
	import type { createWeb3Ctx } from "../../contexts/web3";

	const web3 = getContext<ReturnType<typeof createWeb3Ctx>>("web3");
	const pixels = web3.pixels;
</script>

<PixelPalette pixels={$pixels} cols={14} />
