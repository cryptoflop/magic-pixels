<script lang="ts">
	import { getContext } from "svelte";
	import type { createWeb3Ctx } from "../contexts/web3";
	import { tooltip } from "../directives/tooltip";

	const web3 = getContext<ReturnType<typeof createWeb3Ctx>>("web3");
	const account = web3.account;
</script>

<div class="absolute right-4 top-2">
	<button
		class="button"
		on:click={$account ? web3.disconnect : web3.connect}
		use:tooltip={$account ? "Disconnect" : "Connect wallet"}
	>
		{$account ? $account.substring(0, 5) + ".." : "Connect"}
	</button>
</div>
