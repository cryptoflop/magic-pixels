<script lang="ts">
	import { getContext } from "svelte";
	import type { createWeb3Ctx } from "../contexts/web3";
	import PixelPalette from "../elements/PixelPalette.svelte";
	import {
		MAX_PIXEL,
		formatDelay,
		fullPixelName,
		hexToRgb,
		pixelColor,
		pixelizeElement,
		pixelsToSvg,
	} from "../helpers/color-utils";
	import PixelizedButton from "../elements/PixelizedButton.svelte";
	import {
		decodePixel,
		encodePixel,
	} from "../../contracts/scripts/libraries/pixel-parser";
	import type { createRoutingCtx } from "../contexts/routing";
	import { fade } from "svelte/transition";
	import { createAudio } from "../helpers/audio";
	import type { createToastCtx } from "../contexts/toast";

	import forgeSrc from "../assets/sounds/forging.mp3";
	import clickSrc from "../assets/sounds/click.mp3";
	import clackSrc from "../assets/sounds/clack.mp3";
	import PixelSelector from "../elements/PixelSelector.svelte";
	import { tooltip } from "../directives/tooltip";

	const click = createAudio(clickSrc, { volume: 0.1 });
	const clack = createAudio(clackSrc, { volume: 0.05 });

	const toast = getContext<ReturnType<typeof createToastCtx>>("toast");

	const routing = getContext<ReturnType<typeof createRoutingCtx>>("routing");

	const web3 = getContext<ReturnType<typeof createWeb3Ctx>>("web3");
	const pixels = web3.pixels;

	$: pixelsArr = $pixels.toArray();

	const PLATE_DIMENSIONS = [8, 16, 24];

	const PIXEL_SIZES = {
		8: 48,
		16: 24,
		24: 16,
	};

	let dimension = PLATE_DIMENSIONS[1];

	$: size = PIXEL_SIZES[dimension as keyof typeof PIXEL_SIZES];

	let placedPixels: PixelId[] = [];
	let delays: { [key: number]: number } = {};

	let flash = false;

	let pressedKeys: Record<string, boolean> = {};
	const up = (e: KeyboardEvent) => (pressedKeys[e.key] = false);
	const down = (e: KeyboardEvent) => (pressedKeys[e.key] = true);

	let hovering = -1;
	$: hoveringName = pressedKeys["Control"]
		? hovering > 0
			? fullPixelName(decodePixel(placedPixels[hovering]))
			: "Empty"
		: null;

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

	let artisanMode = false;

	// WORK IN PROGSS SECTION
	(window as any).artisan = () => {
		artisanMode = true;
	};

	(window as any).save = (name: string) => {
		localStorage.setItem(
			"PLATE_" + name,
			JSON.stringify({ pixels: placedPixels, delays }),
		);
	};

	(window as any).load = (name: string) => {
		const { pixels, delays: dlys } = JSON.parse(
			localStorage.getItem("PLATE_" + name)!,
		);
		dimension = Math.sqrt(pixels.length);
		placedPixels = pixels;
		delays = dlys;
	};

	(window as any).parseImg = () => {
		const input = document.createElement("input");
		input.type = "file";
		input.style.position = "fixed";
		input.style.top = "0";
		document.body.append(input);
		input.onchange = () => {
			input.remove();
			if (!input.files || input.files.length === 0) {
				alert("No file selected");
				return;
			}

			const file = input.files[0];

			const reader = new FileReader();
			reader.onload = function (e) {
				const img = new Image();
				img.onload = function () {
					const canvas = document.createElement("canvas");
					const context = canvas.getContext("2d")!;

					canvas.width = img.width;
					canvas.height = img.height;

					context.drawImage(img, 0, 0, img.width, img.height);

					const imageData = context.getImageData(0, 0, img.width, img.height);
					const pixelData = imageData.data;

					const dim = Math.sqrt(pixelData.length / 4);
					const allColors = Array(MAX_PIXEL)
						.fill(1)
						.map((_, i) => hexToRgb(pixelColor(i + 1)));
					const p = [];
					for (let i = 0; i < dim; i++) {
						for (let j = 0; j < dim; j++) {
							const index = (i * dim + j) * 4;
							const pixel = [
								pixelData[index],
								pixelData[index + 1],
								pixelData[index + 2],
							];
							p.push(pixel);
						}
					}

					function rgbDist(c1: number[], c2: number[]) {
						const r1 = c1[0],
							g1 = c1[1],
							b1 = c1[2];
						const r2 = c2[0],
							g2 = c2[1],
							b2 = c2[2];
						return Math.sqrt(
							Math.pow(r1 - r2, 2) +
								Math.pow(g1 - g2, 2) +
								Math.pow(b1 - b2, 2),
						);
					}

					const nearestPxls = p.map((ogPxl) => {
						const distances = allColors.map((pxl) => rgbDist(ogPxl, pxl));
						let idx = MAX_PIXEL;
						let smallest = 1000;
						for (let i = 0; i < distances.length; i++) {
							if (distances[i] < smallest) {
								idx = i + 1;
								smallest = distances[i];
							}
						}
						return idx;
					});

					placedPixels = nearestPxls.map((i) => encodePixel([i]));
				};
				img.src = e.target!.result! as string;
			};
			reader.readAsDataURL(file);
		};
	};

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
		{ toSub: placedPixels.filter((id) => id), res: [] as PixelId[] },
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
		el.className = "cursor-grabbing";
		el.style.zIndex = "0";
		const elVis = document.createElement("div");
		pixelizeElement(elVis, pxl);
		elVis.style.zIndex = "2";
		elVis.style.pointerEvents = "none";
		elVis.style.left = e.clientX - 14 + "px";
		elVis.style.top = e.clientY - 14 + "px";
		elVis.className = "h-6 w-6 border-2";
		el.append(elVis);
		document.body.appendChild(el);

		function onMove(e: MouseEvent) {
			el.style.left = e.clientX - 14 + "px";
			el.style.top = e.clientY - 14 + "px";
		}

		onMove(e);

		function onRelease(e: MouseEvent) {
			el.remove();
			document.body.classList.remove("cursor-grabbing");
			document.body.removeEventListener("mousemove", onMove);
			document.body.removeEventListener("mouseup", onRelease);

			const target = e.target as HTMLElement;
			if (target.id != "drop-overlay") {
				grabbed = null;
				return;
			}
			drop(
				Math.floor(e.offsetY / size) * dimension + Math.floor(e.offsetX / size),
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
			clack.play();
		} else {
			placedPixels[i] = grabbed;
			grabbed = null;
			click.play();
		}
		placedPixels = [...placedPixels];
	}

	function updateHover(e: MouseEvent & { layerX?: number; layerY?: number }) {
		const target = e.target as HTMLElement;
		if (target.id == "drop-overlay") {
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
			(pressedKeys["Shift"]
				? Math.abs((v % 10) + (e.deltaY > 0 ? -10 : 0)) || 10
				: 1);
		const max = pxl.length * 60;
		if (dir < 0 && v + dir < 0) {
			delays[hovering] = max + dir;
		} else {
			delays[hovering] = (v + dir) % max;
		}
		delays = { ...delays };
	}

	function releasePixel(e: MouseEvent) {
		const idx =
			Math.floor(e.offsetY / size) * dimension + Math.floor(e.offsetX / size);
		drop(idx);
		delete delays[idx];
	}

	let name = "";

	function validateName(input: HTMLInputElement) {
		name = input.value.replaceAll(/[^a-zA-Z\s]+/g, "");
	}

	async function mint() {
		createAudio(forgeSrc, {
			autoPlay: true,
			volume: 0.1,
			disposable: true,
		});
		const plate = await web3.mint(name!.trim(), placedPixels, delaysPacked);
		routing.goto("treasury", "plate", { id: plate.id.toString() });
		toast.show('You successfully forged plate "' + plate.name + '"');
	}
</script>

<svelte:document on:keyup={up} on:keydown={down} />

<div
	class="grid grid-cols-[min-content,min-content] grid-rows-[1fr,min-content] gap-x-4 gap-y-2 m-auto"
>
	{#if artisanMode}
		<PixelSelector
			cols={5}
			on:mousedown={(e) => grab(e.detail.pxl, e.detail.ev)}
		/>
	{:else}
		<PixelPalette
			classPixel="cursor-grab"
			pixels={availablePixels.map((id) => decodePixel(id))}
			cols={5}
			on:mousedown={(e) => grab(e.detail.pxl, e.detail.ev)}
			bind:filtered={filteredPixels}
		/>
	{/if}

	<div class="border-2 grid group relative">
		{#if flash}
			<div class="absolute inset-0 bg-white/80 animate-pulse z-[-1]" />
		{/if}

		<input
			class="absolute left-0 -translate-y-8 h-[22px] w-[18ch] px-1 -translate-x-0.5 outline-none border-2 bg-transparent"
			placeholder="Name"
			bind:value={name}
			on:input={(e) => validateName(e.currentTarget)}
		/>

		<select
			class="absolute select-none right-0 -translate-y-8 translate-x-0.5"
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
				delaysPacked,
			)}
		/>

		<div
			id="drop-overlay"
			class="absolute cursor-pointer inset-0 z-[1]"
			on:click={releasePixel}
			on:mousemove={updateHover}
			on:mouseleave={() => (hovering = -1)}
			on:wheel={onHoverWheel}
			use:tooltip={hoveringName}
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
								When hovering over any multicolor pixel, scroll to adjust the time
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
			disabled={placedPixelsCount < dimension ** 2 || !name}
			options={{ colored: true }}
			action={mint}
			on:mouseenter={() => (flash = true)}
			on:mouseleave={() => (flash = false)}
		>
			<span slot="default">Mint</span>
			<span slot="executing">Minting...</span>
		</PixelizedButton>
	</div>
</div>
