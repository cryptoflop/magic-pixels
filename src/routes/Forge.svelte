<script lang="ts">
	import { getContext, onDestroy, onMount, tick } from "svelte";
	import type { createWeb3Ctx } from "../contexts/web3";
	import PixelPalette from "../elements/PixelPalette.svelte";
	import { EMPTY, comparePixel, formatDelay, pixelColor, pixelizeElement, pixelsToSvg } from "../helpers/color-utils";
	import { PLATE_SIZE } from "../values";

	const PIXEL_SIZE = 24;

	const web3 = getContext<ReturnType<typeof createWeb3Ctx>>("web3");
	const pixels = web3.pixels;

	let placedPixelsIndices: number[];

	let delays: { [key: number]: number } = {};

	let flash = false;

	let hovering = -1;

	$: placedPixels = placedPixelsIndices.map((i) => $pixels[i]);

	$: delaysPacked = Object.keys(delays).map((k) => [Number(k), delays[Number(k)]]);

	function clear() {
		placedPixelsIndices = Array(PLATE_SIZE ** 2).fill(-1);
		delays = {};
	}
	clear();

	function rnd() {
		placedPixelsIndices = Array(PLATE_SIZE ** 2)
			.fill(1)
			.map((_, i) => i)
			.map((idx, i) => (i >= $pixels.length ? -1 : idx))
			.sort(() => 0.5 - Math.random());
	}

	$: placedPixelsCount = placedPixelsIndices.filter((p) => p >= 0).length;

	$: availablePixels = $pixels.filter((_, i) => placedPixelsIndices.findIndex((idx) => idx == i) == -1); // removed placed pixels

	let filteredPixels: PixelData[] = [];

	let grabbed: number | null;
	function grab(pxl: PixelData, e: MouseEvent) {
		grabbed = $pixels.findIndex((p, i) => placedPixelsIndices.findIndex((idx) => idx == i) == -1 && comparePixel(pxl, p));

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
			drop(Math.floor(e.offsetY / PIXEL_SIZE) * PLATE_SIZE + Math.floor(e.offsetX / PIXEL_SIZE));
		}
		document.body.addEventListener("mousemove", onMove);
		document.body.addEventListener("mouseup", onRelease);
	}

	function drop(i: number) {
		if (grabbed == null) {
			placedPixelsIndices[i] = -1;
			placedPixelsIndices = [...placedPixelsIndices];
			delete delays[i];
			delays = { ...delays };
		} else {
			placedPixelsIndices[i] = grabbed;
			placedPixelsIndices = [...placedPixelsIndices];
			grabbed = null;
		}
	}

	function updateHover(e: MouseEvent & { layerX?: number; layerY?: number }) {
		const target = e.target as HTMLElement;
		if (target.tagName == "IMG") {
			const idx = Math.floor(e.offsetY / PIXEL_SIZE) * PLATE_SIZE + Math.floor(e.offsetX / PIXEL_SIZE);
			if (idx == hovering) return;
			if (placedPixelsIndices[idx] == -1) {
				hovering = -1;
			} else {
				hovering = idx;
			}
		} else {
			hovering = -1;
		}
	}

	let shiftPressed = false;
	const up = (e: KeyboardEvent) => (shiftPressed = e.key == "Shift" ? false : shiftPressed);
	document.addEventListener("keyup", up);
	const down = (e: KeyboardEvent) => (shiftPressed = e.shiftKey);
	document.addEventListener("keydown", down);
	onDestroy(() => {
		document.removeEventListener("keyup", up);
		document.removeEventListener("keydown", down);
	});

	function onHoverWheel(e: WheelEvent) {
		if (hovering < 0) return;
		if (!localStorage.getItem("delayHint")) localStorage.setItem("delayHint", "true");
		const v = delays[hovering] || 0;
		const dir = (e.deltaY > 0 ? 1 : -1) * (shiftPressed ? Math.abs((v % 10) + (e.deltaY > 0 ? -10 : 0)) || 10 : 1);
		const max = $pixels[placedPixelsIndices[hovering]].length * 100;
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
		const idx = Math.floor(e.offsetY / PIXEL_SIZE) * PLATE_SIZE + Math.floor(e.offsetX / PIXEL_SIZE);
		drop(idx);
		delete delays[idx];
	}
</script>

<div class="grid grid-cols-[min-content,min-content] grid-rows-[1fr,min-content] gap-x-4 gap-y-2 m-auto">
	<PixelPalette
		pixels={availablePixels}
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

		<img
			class="select-none"
			style="max-width: none;"
			draggable="false"
			height="{PLATE_SIZE * PIXEL_SIZE}px"
			width="{PLATE_SIZE * PIXEL_SIZE}px"
			src={pixelsToSvg(
				placedPixels.map((p) => p ?? [EMPTY]),
				delaysPacked
			)}
		/>
	</div>

	<div>
		<div class="text-xs ml-2 mt-1">
			{filteredPixels.length} pixels
		</div>
	</div>

	<div class="mx-2 flex">
		<div class="text-xs mt-1">
			{PLATE_SIZE ** 2 - placedPixelsCount} empty pixels
		</div>

		<div class="flex mx-auto text-xs mt-1">
			{#if hovering >= 0 && $pixels[placedPixelsIndices[hovering]]?.length > 1}
				<div class="">{formatDelay(delays[hovering] || 0)}s</div>
				{#if !localStorage.getItem("delayHint")}
					<div class="relative fade-in">
						<div class="absolute border-2 px-1 py-0.5 text-center w-[120px] left-[-72px] top-[20px]">
							Hover over any multicolor pixel and scroll to adjust the time offset! Press shift to use decimal steps.
						</div>
					</div>
				{/if}
			{/if}
		</div>

		<button class="button -mt-0.5 text-lg" on:click={clear}>Clear</button>
		<span>&ensp;|&ensp;</span>
		<button class="button -mt-0.5 text-lg" on:click={rnd}>Rnd</button>
		<span>&ensp;|&ensp;</span>
		<button
			class="button -mt-0.5 text-lg"
			disabled={placedPixelsCount < PLATE_SIZE ** 2}
			on:click={() => web3.mint(placedPixelsIndices, delaysPacked)}
			on:mouseenter={() => (flash = true)}
			on:mouseleave={() => (flash = false)}
		>
			Mint
		</button>
	</div>
</div>
