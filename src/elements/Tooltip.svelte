<script lang="ts">
	export let title: string;
	export let x: number;
	export let y: number;

	let el: HTMLDivElement;
</script>

<div
	bind:this={el}
	class="border-2 bg-black px-2 py-0.5 absolute z-50 whitespace-pre-line text-center text-base/5 pointer-events-none"
	style="top: {y - 34}px; left: {x - el?.clientWidth - 4}px;"
>
	{title}
</div>
