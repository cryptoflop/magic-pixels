<script lang="ts">
	import { getContext } from "svelte";
	import type { createWeb3Ctx } from "../contexts/web3";

	import polygon from "../assets/images/polygon.svg";
	import arbitrum from "../assets/images/arbitrum.svg";
	import mantle from "../assets/images/mantle.svg";
	import { tooltip } from "../directives/tooltip";

	const web3 = getContext<ReturnType<typeof createWeb3Ctx>>("web3");
	const account = web3.account;

	let networks = [polygon, arbitrum, mantle];

	let selected = networks[0];

	$: filteredNetworks = networks.filter((n) => n !== selected);

	let open = false;

	function select(i: number) {
		selected = filteredNetworks[i];
		open = false;
	}
</script>

{#if $account}
	<div class="absolute right-16 top-2">
		<button class="button mt-1 mr-1" on:click={() => (open = !open)}>
			<img src={selected} class="h-4 w-4 pointer-events-none" />
		</button>

		{#if open}
			<div class="grid">
				{#each filteredNetworks as network, i}
					<button
						class="py-0.5 hover:bg-white/20 mr-auto"
						use:tooltip={"Coming Soon!"}
						on:click={() => (open = false)}
					>
						<img src={network} class="h-4 w-4 pointer-events-none opacity-50" />
					</button>
				{/each}
			</div>
		{/if}
	</div>
{/if}
