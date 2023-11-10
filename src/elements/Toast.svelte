<script lang="ts">
	import { getContext } from "svelte";
	import type { createToastCtx } from "../contexts/toast";

	export let text: string;

	const toast = getContext<ReturnType<typeof createToastCtx>>("toast");
</script>

<div class="grid px-2 py-1">
	<div class="whitespace-pre-line text-center">{text}</div>
	<button class="button mt-4 mx-auto" on:click={toast.close}>Ok</button>
</div>
