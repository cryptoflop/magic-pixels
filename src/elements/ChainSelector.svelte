<script lang="ts">
	import { getContext } from "svelte";
	import type { createWeb3Ctx } from "../contexts/web3";
	import { tooltip } from "../directives/tooltip";

	import polygon from "../assets/images/polygon.png";
	import arbitrum from "../assets/images/arbitrum.png";
	import mantle from "../assets/images/mantle.png";
	import { capitalize } from "../helpers/utils";

	const web3 = getContext<ReturnType<typeof createWeb3Ctx>>("web3");

	let chains = [
		{
			id: 1,
			tag: "arbitrum",
			img: arbitrum
		},
		{
			id: 2,
			tag: "matic",
			img: polygon
		},
		{
			id: 3,
			tag: "mantle",
			img: mantle,
			upcoming: true
		}
	];

	let selected = chains[0];

	$: filteredChains = chains.filter((n) => n !== selected);

	let open = false;

	function select(i: number) {
		selected = filteredChains[i];
		open = false;
	}
</script>

<div class="absolute right-16 top-2 mr-1">
	<button class="button p-0.5 border border-transparent hover:border-b-white" on:click={() => (open = !open)}>
		<img src={selected.img} class="h-4 w-4 pointer-events-none" />
	</button>

	{#if open}
		<div class="grid gap-0.5">
			{#each filteredChains as chain, i}
				<button
					class="p-0.5 border border-transparent hover:border-b-white mr-auto"
					use:tooltip={(chain.upcoming ? "Coming Soon: " : "") + capitalize(chain.tag)}
					on:click={chain.upcoming ? undefined : () => select(i)}
				>
					<img src={chain.img} class="h-4 w-4 pointer-events-none {chain.upcoming && "opacity-50"}" />
				</button>
			{/each}
		</div>
	{/if}
</div>
