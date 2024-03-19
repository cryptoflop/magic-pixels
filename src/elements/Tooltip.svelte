<script lang="ts">
	export let title: string;
	export let x: number;
	export let y: number;

	let el: HTMLDivElement;

	$: bottom = y < 50;
	$: left = x === undefined ? true : x > el?.clientWidth;
</script>

<div
	bind:this={el}
	class="border-2 bg-black px-2 py-0.5 absolute z-50 text-center text-base/5 pointer-events-none whitespace-pre"
	style="top: {y + (bottom ? 0 : -el?.clientHeight)}px; left: {x -
		(left ? (el?.clientWidth + 4) : -12)}px;"
>
	{title}
</div>
