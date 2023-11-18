<script lang="ts">
	import { getContext } from "svelte";
	import type { createRoutingCtx } from "../contexts/routing";
	import netherSrc from "../assets/images/nether.png";
	import forgeSrc from "../assets/images/forge.png";
	import treasurySrc from "../assets/images/treasury.png";
	import auctionhouseSrc from "../assets/images/auctionhouse.png";
	import { pixelemitter } from "../directives/pixelemitter";

	const routing = getContext<ReturnType<typeof createRoutingCtx>>("routing");
	const root = routing.root;

	const views = [
		{ route: "Nether", icon: netherSrc },
		{ route: "Forge", icon: forgeSrc },
		{ route: "Treasury", icon: treasurySrc },
		{ route: "Market", icon: auctionhouseSrc },
	];
</script>

<div class="flex space-x-6 mx-auto select-none text-lg">
	{#each views as v}
		<button
			use:pixelemitter={{
				colored: false,
				density: 0.5,
				intensity: 0.5,
				active: v.route.toLowerCase() == $root,
			}}
			class="button flex {v.route.toLowerCase() == $root && 'underline'}"
			on:click={() =>
				v.route.toLowerCase() != $root && routing.goto(v.route.toLowerCase())}
		>
			<img src={v.icon} class="pointer-events-none h-4 w-4 self-center mr-2" />
			{v.route}
		</button>
	{/each}
</div>
