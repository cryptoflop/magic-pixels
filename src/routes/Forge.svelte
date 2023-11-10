<script lang="ts">
	import { getContext, onDestroy } from "svelte";
	import type { createWeb3Ctx } from "../contexts/web3";
	import PixelPalette from "../elements/PixelPalette.svelte";
	import {
		formatDelay,
		pixelizeElement,
		pixelsToSvg,
	} from "../helpers/color-utils";
	import PixelizedButton from "../elements/PixelizedButton.svelte";
	import {
		decodePixel,
		encodePixel,
	} from "../../contracts/scripts/libraries/pixel-parser";
	import { fade } from "svelte/transition";

	const web3 = getContext<ReturnType<typeof createWeb3Ctx>>("web3");
	const pixels = web3.pixels;

	$: pixelsArr = $pixels.toArray();

	const PLATE_DIMENSIONS = [8, 16, 32];

	let dimension = PLATE_DIMENSIONS[1];

	const PIXEL_SIZES = {
		8: 48,
		16: 24,
		32: 12,
	};

	$: size = PIXEL_SIZES[dimension as keyof typeof PIXEL_SIZES];

	let placedPixels: PixelId[] = [];
	let delays: { [key: number]: number } = {};

	let flash = false;

	let hovering = -1;

	let showDelayHint = !localStorage.getItem("delayHint");

	$: delaysPacked = Object.keys(delays).map((k) => ({
		idx: Number(k),
		delay: delays[Number(k)],
	}));

	function clear() {
		placedPixels = Array(dimension ** 2).fill("");
		delays = {};
	}
	$: {
		if (dimension) {
			setTimeout(clear);
		}
	}
	clear();

	function rnd() {
		placedPixels = Array(dimension ** 2)
			.fill(1)
			.map((_, i) => i)
			.map((idx, i) => (i >= pixelsArr.length ? "" : pixelsArr[idx]) as PixelId)
			.sort(() => 0.5 - Math.random());
	}

	$: placedPixelsCount = placedPixels.filter((p) => p).length;

	$: availablePixels = pixelsArr.reduce(
		(state, id) => {
			const idx = state.toSub.indexOf(id);
			if (idx >= 0) {
				state.toSub.splice(idx, 1);
			} else {
				state.res.push(id);
			}
			return state;
		},
		{ toSub: placedPixels.filter((id) => id), res: [] as PixelId[] }
	).res;

	let filteredPixels: Pixel[] = [];

	let grabbed: PixelId | null;
	function grab(pxl: Pixel, e: MouseEvent) {
		if (window.getSelection) {
			window.getSelection()?.removeAllRanges();
		} else if (document.getSelection) {
			document.getSelection()?.empty();
		}

		grabbed = encodePixel(pxl);

		document.body.classList.add("cursor-grabbing");

		const el = document.createElement("div");
		el.style.position = "absolute";
		el.style.left = e.clientX - 14 + "px";
		el.style.top = e.clientY - 14 + "px";
		el.style.pointerEvents = "none";
		el.className = "h-6 w-6 border-2 border-dashed";
		pixelizeElement(el, pxl);
		document.body.appendChild(el);

		function onMove(e: MouseEvent) {
			el.style.left = e.clientX - 14 + "px";
			el.style.top = e.clientY - 14 + "px";
		}
		function onRelease(e: MouseEvent) {
			el.remove();
			document.body.classList.remove("cursor-grabbing");
			document.body.removeEventListener("mousemove", onMove);
			document.body.removeEventListener("mouseup", onRelease);

			const target = e.target as HTMLElement;
			if (target.tagName != "IMG") return;
			drop(
				Math.floor(e.offsetY / size) * dimension + Math.floor(e.offsetX / size)
			);
		}
		document.body.addEventListener("mousemove", onMove);
		document.body.addEventListener("mouseup", onRelease);
	}

	function drop(i: number) {
		if (grabbed == null) {
			placedPixels[i] = "" as PixelId;
			delete delays[i];
			delays = { ...delays };
		} else {
			placedPixels[i] = grabbed;
			grabbed = null;
		}
		placedPixels = [...placedPixels];
	}

	function updateHover(e: MouseEvent & { layerX?: number; layerY?: number }) {
		const target = e.target as HTMLElement;
		if (target.tagName == "IMG") {
			const idx =
				Math.floor(e.offsetY / size) * dimension + Math.floor(e.offsetX / size);
			if (idx == hovering) return;
			if (placedPixels[idx]) {
				hovering = idx;
			} else {
				hovering = -1;
			}
		} else {
			hovering = -1;
		}
	}

	let shiftPressed = false;
	const up = (e: KeyboardEvent) =>
		(shiftPressed = e.key == "Shift" ? false : shiftPressed);
	document.addEventListener("keyup", up);
	const down = (e: KeyboardEvent) => (shiftPressed = e.shiftKey);
	document.addEventListener("keydown", down);
	onDestroy(() => {
		document.removeEventListener("keyup", up);
		document.removeEventListener("keydown", down);
	});

	function onHoverWheel(e: WheelEvent) {
		if (hovering < 0) return;
		const pxl = decodePixel(placedPixels[hovering]!);
		if (pxl.length < 2) return;
		if (!localStorage.getItem("delayHint")) {
			localStorage.setItem("delayHint", "true");
			showDelayHint = false;
		}
		const v = delays[hovering] || 0;
		const dir =
			(e.deltaY > 0 ? 1 : -1) *
			(shiftPressed ? Math.abs((v % 10) + (e.deltaY > 0 ? -10 : 0)) || 10 : 1);
		const max = pxl.length * 60;
		if (dir < 0 && v + dir < 0) {
			delays[hovering] = max + dir;
		} else {
			delays[hovering] = (v + dir) % max;
		}
		delays = { ...delays };
	}

	function releasePixel(e: MouseEvent) {
		const target = e.target as HTMLElement;
		if (target.tagName != "IMG") return;
		const idx =
			Math.floor(e.offsetY / size) * dimension + Math.floor(e.offsetX / size);
		drop(idx);
		delete delays[idx];
	}
</script>

<div
	class="grid grid-cols-[min-content,min-content] grid-rows-[1fr,min-content] gap-x-4 gap-y-2 m-auto"
>
	<PixelPalette
		pixels={availablePixels.map((id) => decodePixel(id))}
		cols={5}
		on:mousedown={(e) => grab(e.detail.pxl, e.detail.ev)}
		bind:filtered={filteredPixels}
		classPixel="cursor-grab"
	/>

	<div
		class="border-2 grid group relative"
		on:mousemove={updateHover}
		on:mouseleave={() => (hovering = -1)}
		on:wheel={onHoverWheel}
		on:click={releasePixel}
	>
		{#if flash}
			<div class="absolute inset-0 bg-white/80 animate-pulse z-[-1]" />
		{/if}

		<select
			class="absolute ml-auto right-0 -translate-y-8 translate-x-0.5"
			bind:value={dimension}
		>
			{#each PLATE_DIMENSIONS as dim}
				<option value={dim}>{dim}x{dim}</option>
			{/each}
		</select>

		<img
			class="select-none"
			style="max-width: none;"
			draggable="false"
			height="{dimension * size}px"
			width="{dimension * size}px"
			src={pixelsToSvg(
				placedPixels.map((p) => (p ? decodePixel(p) : [])),
				delaysPacked
			)}
		/>
	</div>

	<div>
		<div class="text-xs mt-1">
			{filteredPixels.length} pixels
		</div>
	</div>

	<div class="flex">
		<div class="text-xs mt-1">
			{dimension ** 2 - placedPixelsCount} empty pixels
		</div>

		<div class="flex mx-auto text-xs mt-1">
			{#if hovering >= 0 && placedPixels[hovering] && decodePixel(placedPixels[hovering]).length > 1}
				<div transition:fade={{ duration: 100 }}>
					{formatDelay(delays[hovering] || 0)}s
					{#if showDelayHint}
						<div class="relative" transition:fade={{ duration: 100 }}>
							<div
								class="absolute border-2 px-1 py-0.5 text-center w-[120px] mt-2 -ml-12"
							>
								Hover over any multicolor pixel and scroll to adjust the time
								offset! Press shift to use decimal steps.
							</div>
						</div>
					{/if}
				</div>
			{/if}
		</div>

		<button class="button -mt-0.5 text-lg" on:click={clear}>Clear</button>
		<span>&ensp;|&ensp;</span>
		<button class="button -mt-0.5 text-lg" on:click={rnd}>Rnd</button>
		<span>&ensp;|&ensp;</span>

		<PixelizedButton
			class="-mt-0.5 text-lg"
			disabled={placedPixelsCount < dimension ** 2}
			options={{ colored: true, density: 3 }}
			action={async () => {
				await web3.mint(placedPixels, delaysPacked);
				clear();
			}}
			on:mouseenter={() => (flash = true)}
			on:mouseleave={() => (flash = false)}
		>
			<span slot="default">Mint</span>
			<span slot="executing">Minting...</span>
		</PixelizedButton>
	</div>
</div>
