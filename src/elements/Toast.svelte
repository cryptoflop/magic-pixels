<script lang="ts">
	import { getContext } from "svelte";
	import type { createToastCtx } from "../contexts/toast";

	export let text: string;

	const toast = getContext<ReturnType<typeof createToastCtx>>("toast");
</script>

<div class="grid px-4 py-2">
	<div class="whitespace-pre-line text-center">{text}</div>
	<button class="button mt-2 mx-auto" on:click={toast.close}>Ok</button>
</div>
