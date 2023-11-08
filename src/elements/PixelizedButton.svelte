<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import {
		type EmitterOptions,
		pixelemitter,
	} from "../directives/pixelemitter";

	const dispatch = createEventDispatcher();

	export let options: Partial<EmitterOptions> = {};

	let className = "";
	export { className as class };

	export let disabled = false;

	let hovering = false;

	export let action: () => Promise<void>;

	let executing = false;

	async function executeAction() {
		if (disabled || executing) return;

		executing = true;

		try {
			await action();
		} catch (err) {
			console.error(err);
		}

		executing = false;
	}
</script>

<button
	on:mouseenter={() => {
		hovering = true;
		dispatch("mouseenter");
	}}
	on:mouseleave={() => {
		hovering = false;
		dispatch("mouseleave");
	}}
	on:click={executeAction}
	class="select-none !opacity-100 {disabled || executing
		? 'cursor-default'
		: 'button'} {className}"
	use:pixelemitter={{
		active: hovering || executing,
		opacity: disabled ? 0.4 : 1,
		intensity: options.active ? (hovering || executing ? 1.4 : 1) : 1,
		...options,
	}}
>
	<span class={disabled ? "opacity-50" : ""}>
		{#if executing}
			<slot name="executing" />
		{:else}
			<slot />
		{/if}
	</span>
</button>
