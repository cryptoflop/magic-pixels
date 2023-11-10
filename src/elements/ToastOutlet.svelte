<script lang="ts">
	import { getContext } from "svelte";
	import { fade } from "svelte/transition";
	import type { createToastCtx } from "../contexts/toast";

	const toast = getContext<ReturnType<typeof createToastCtx>>("toast");
	const toastComponent = toast.current;
</script>

{#if $toastComponent !== null}
	<div
		class="absolute inset-0 bg-black/50 grid z-10"
		transition:fade={{ duration: 300 }}
	>
		<div class="grid bg-black m-auto border-2 border-white/60">
			<svelte:component
				this={$toastComponent.component}
				{...$toastComponent.props}
			/>
		</div>
	</div>
{/if}
