<script lang="ts">
	import { getContext, onMount } from "svelte";
	import type { createToastCtx } from "../contexts/toast";
	import { pixelemitter } from "../directives/pixelemitter";
	import { createAudio } from "../helpers/audio";
	import sparkleSrc from "../assets/sounds/sparkle.mp3";
	import type { createWeb3Ctx } from "../contexts/web3";

	export let amount: string;

	const toast = getContext<ReturnType<typeof createToastCtx>>("toast");
	const web3 = getContext<ReturnType<typeof createWeb3Ctx>>("web3");
	const chain = web3.chain;

	onMount(() =>
		createAudio(sparkleSrc, {
			autoPlay: true,
			volume: 0.08,
			playbackRate: 1.5,
			disposable: true,
		})
	);
</script>

<div class="grid px-6 py-2">
	<div class="text-center">
		What a suprise!<br /> Inbetween the pixels you found something else...
	</div>
	<div
		class="text-center text-xl mt-2"
		use:pixelemitter={{ active: true, colored: true }}
	>
		You found {amount}
		{$chain?.symbol}
	</div>
	<button class="button mt-4 mx-auto" on:click={toast.close}>Ok</button>
</div>
