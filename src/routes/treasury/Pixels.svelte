<script lang="ts">
	import PixelPalette from "../../elements/PixelPalette.svelte";
	import { getContext } from "svelte";
	import type { createWeb3Ctx } from "../../contexts/web3";
	import { decodePixel } from "../../../contracts/scripts/libraries/pixel-parser";

	const web3 = getContext<ReturnType<typeof createWeb3Ctx>>("web3");
	const pixels = web3.pixels;

	const pixelArr = $pixels.toArray().map((id) => decodePixel(id));
</script>

<PixelPalette pixels={pixelArr} cols={14} />
