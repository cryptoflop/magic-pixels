<script lang="ts">
	import { getContext } from "svelte";
	import type { createRoutingCtx } from "../../contexts/routing";
	import PixelizedButton from "../../elements/PixelizedButton.svelte";
	import type { createWeb3Ctx } from "../../contexts/web3";
	import Plt from "../../elements/Plate.svelte";
	import type { createToastCtx } from "../../contexts/toast";
	import { createAudio } from "../../helpers/audio";
	import shatterSrc from "../../assets/shatter.mp3";

	const toast = getContext<ReturnType<typeof createToastCtx>>("toast");

	const web3 = getContext<ReturnType<typeof createWeb3Ctx>>("web3");
	const plates = web3.plates;

	const routing = getContext<ReturnType<typeof createRoutingCtx>>("routing");
	const param = routing.param;

	let isOwnPlate = false;
	let plate: undefined | null | Plate = undefined;

	$: {
		if ($param?.id) {
			const tokenId = BigInt($param!.id);
			const ownPlate = $plates.find((p) => p.id == tokenId);
			if (ownPlate) {
				isOwnPlate = true;
				plate = ownPlate;
			} else {
				web3
					.getPlate(tokenId)
					.then((p) => (plate = p?.pixels.length > 0 ? p : null));
				isOwnPlate = false;
			}
		} else {
			plate = null;
		}
	}

	const plateSize = (plate: Plate) => {
		const s = Math.sqrt(plate.pixels.length);
		return s + "x" + s;
	};

	async function shatter() {
		await web3.shatter(plate!.id);
		routing.goto("treasury", { view: "pixels" }, "treasury");
		createAudio(shatterSrc, {
			autoPlay: true,
			volume: 0.1,
			disposable: true,
		});
		toast.show(`You restored ${plate!.pixels.length} pixels.`);
	}
</script>

<div class="m-auto grid gap-2">
	<button class="button mr-auto" on:click={routing.goback}>go back</button>

	<div class="border-2">
		{#if plate === undefined}
			<div class="border-2 p-4">Fetching plate...</div>
		{/if}

		{#if plate === null}
			<div class="border-2 p-4">This plate does not exists</div>
		{/if}

		{#if plate}
			<div class="flex justify-between text-xl px-2">
				<span>#{plate.id.toString()}</span>
				<span>{plateSize(plate)}</span>
			</div>
			<Plt class="w-[40vh]" {plate} />
		{/if}
	</div>

	{#if plate && isOwnPlate}
		<div class="ml-auto">
			<PixelizedButton action={shatter}>
				<span slot="default">Shatter</span>
				<span slot="executing">Smashing...</span>
			</PixelizedButton>
		</div>
	{/if}
</div>
