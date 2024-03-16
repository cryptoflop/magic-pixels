<script lang="ts">
	import { getContext } from "svelte";
	import { tooltip } from "../../directives/tooltip";
	import type { createRoutingCtx } from "../../contexts/routing";
	import PixelizedButton from "../../elements/PixelizedButton.svelte";
	import type { createWeb3Ctx } from "../../contexts/web3";
	import Plt from "../../elements/Plate.svelte";
	import type { createToastCtx } from "../../contexts/toast";
	import { createAudio } from "../../helpers/audio";
	import shatterSrc from "../../assets/sounds/shatter.mp3";
	import openseaImg from "../../assets/images/sea.png";

	const toast = getContext<ReturnType<typeof createToastCtx>>("toast");

	const web3 = getContext<ReturnType<typeof createWeb3Ctx>>("web3");
	const plates = web3.plates;
	const chain = web3.chain;
	const acc = web3.account;

	const routing = getContext<ReturnType<typeof createRoutingCtx>>("routing");
	const params = routing.params;

	let isOwnPlate = false;
	let plate: undefined | null | Plate = undefined;

	$: {
		if ($chain) {
			if ($params?.id) {
				const tokenId = BigInt($params!.id);
				const ownPlate = $plates.find((p) => p.id == tokenId);
				if (ownPlate) {
					isOwnPlate = true;
					plate = ownPlate;
				} else {
					web3
						.getPlate(tokenId)
						.then((p) => (plate = p?.pixels.length > 0 ? p : null))
						.catch(() => (plate = null));
					isOwnPlate = false;
				}
			} else {
				plate = null;
			}
		}
	}

	$: marketplaceLink = `https://opensea.io/assets/${$chain?.tag}/${$chain?.contracts.plts}/${plate?.id}`;

	const plateSize = (plate: Plate) => {
		const s = Math.sqrt(plate.pixels.length);
		return s + "x" + s;
	};

	async function shatter() {
		await web3.shatter(plate!.id);
		routing.goto("treasury", undefined, { view: "pixels" });
		createAudio(shatterSrc, {
			autoPlay: true,
			volume: 0.1,
			disposable: true,
		});
		toast.show(`You restored ${plate!.pixels.length} pixels.`);
	}
</script>

<div class="m-auto grid gap-2">
	<div class="flex justify-between">
		<button class="button" on:click={routing.goback}>go back</button>
		{#if plate}
			<button
				class="button"
				use:tooltip={"Copy the link to this plate."}
				on:click={() =>
					navigator.clipboard.writeText(
						`${window.location.origin}?root=market&route=plate&chain=${$chain?.tag}&id=${plate?.id}`,
					)}
			>
				Share
			</button>
		{/if}
	</div>

	<div class="border-2">
		{#if plate === undefined}
			<div class="border-2 p-4">Fetching plate...</div>
		{/if}

		{#if plate === null}
			<div class="border-2 p-4">This plate does not exists</div>
		{/if}

		{#if plate}
			<div class="flex px-2 items-center">
				<div class="text-xl mr-auto">{plate.name}</div>
				<div class="text-sm mr-4" use:tooltip={"Owner: " + plate.owner}>
					<span class="opacity-50 text-xs">Owner:</span>
					{plate.owner == $acc ? "You" : plate.owner.substring(0, 6) + ".."}
				</div>
				<div
					class="text-sm"
					use:tooltip={"Plate dimensions: " + plateSize(plate)}
				>
					<span class="opacity-50 text-xs">Size:</span>
					{plateSize(plate)}
				</div>
			</div>
			<Plt class="w-[40vh]" {plate} />
		{/if}
	</div>

	<div class="flex">
		{#if plate}
			{#if isOwnPlate}
				<PixelizedButton action={shatter}>
					<span slot="default">Shatter</span>
					<span slot="executing">Smashing...</span>
				</PixelizedButton>
			{/if}

			<a
				href={marketplaceLink}
				target="”_blank”"
				class="button ml-auto flex items-center gap-1"
			>
				Marketplace
				<img src={openseaImg} class="w-4 h-4" />
			</a>
		{/if}
	</div>
</div>
