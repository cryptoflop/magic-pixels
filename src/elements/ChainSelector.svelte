<script lang="ts">
	import { getContext } from "svelte";
	import type { createWeb3Ctx } from "../contexts/web3";
	import { arbitrum, base, mantle, polygon } from "viem/chains";
	import { tooltip } from "../directives/tooltip";
	import { capitalize } from "../helpers/utils";

	import baseImg from "../assets/images/base.png";
	import polygonImg from "../assets/images/polygon.png";
	import arbitrumImg from "../assets/images/arbitrum.png";
	import mantleImg from "../assets/images/mantle.png";

	const web3 = getContext<ReturnType<typeof createWeb3Ctx>>("web3");
	const currentChain = web3.chain;

	let chains = [
		{
			id: base.id,
			tag: "base",
			img: baseImg
		},
		{
			id: polygon.id,
			tag: "matic",
			img: polygonImg
		},
		{
			id: arbitrum.id,
			tag: "arbitrum",
			img: arbitrumImg,
			upcoming: true
		},
		{
			id: mantle.id,
			tag: "mantle",
			img: mantleImg,
			upcoming: true
		}
	];

	$: filteredChains = chains.filter((n) => n !== selected);

	$: selected = chains.find(c => c.tag === ($currentChain?.tag ?? chains[0].tag))!

	let open = false;

	function select(id: number) {
		web3.switchChain(id as Parameters<typeof web3.switchChain>[0], true)
		open = false;
	}
</script>

<div class="absolute right-16 top-2 mr-1">
	<button class="button p-0.5 border border-transparent hover:border-b-white" on:click={() => (open = !open)}>
		<img src={selected.img} class="h-4 w-4 pointer-events-none" />
	</button>

	{#if open}
		<div class="grid gap-0.5">
			{#each filteredChains as chain}
				<button
					class="p-0.5 border border-transparent hover:border-b-white mr-auto"
					use:tooltip={(chain.upcoming ? "Coming Soon: " : "") + capitalize(chain.tag)}
					on:click={chain.upcoming ? undefined : () => select(chain.id)}
				>
					<img src={chain.img} class="h-4 w-4 pointer-events-none {chain.upcoming && "opacity-50"}" />
				</button>
			{/each}
		</div>
	{/if}
</div>
