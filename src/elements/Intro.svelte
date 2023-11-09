<script lang="ts">
	import { pixelemitter } from "../directives/pixelemitter";
	import { tooltip } from "../directives/tooltip";

	function done(e: MouseEvent) {
		localStorage.setItem("intro", "true");
		(e.target as HTMLElement).parentElement!.parentElement!.remove();
	}
</script>

<div class="absolute inset-0 bg-black/50 grid z-10">
	<div
		class="grid p-4 relative bg-black m-auto border-2 border-white/60 text-center"
	>
		<h1
			class="text-xl mx-auto mb-4 mt-2 block"
			use:pixelemitter={{ active: true, colored: true }}
		>
			Welcome to the Nether!
		</h1>
		<span>
			Start your journey by conjuring pixels from the <span
				class="underline cursor-pointer"
				use:tooltip={"The Nether is the place from where you can conjure pixels."}
				>Nether</span
			>.
		</span>
		<span class="text-sm opacity-75">
			(There is a small chance to find something else thats <span
				class="underline cursor-pointer"
				use:tooltip={"Every 8th pixel there is a chance of 1 in 100,000\n to find 10% of all recent conjurement proceeds."}
				>valuable</span
			> while conjuring!)
		</span>
		<span class="pt-1">
			You can <span
				class="underline cursor-pointer"
				use:tooltip={"The Forge is where you can put together pixels\n into so called plates (NFT) which you can then mint."}
				>Forge</span
			> pixels into a plate and break plates back into pixels.
		</span>
		<span class="pt-1">
			The <span
				class="underline cursor-pointer"
				use:tooltip={"The Treasury is where you can see\n all pixels and plates you own."}
				>Treasury</span
			> holds all your pixels and plates.
		</span>
		<span class="pt-1">
			Go visit the <span
				class="underline cursor-pointer"
				use:tooltip={"If you're looking to sell or buy pixels the Market is\n where you can open and close trades with other people."}
				>Market</span
			> if you want to trade pixels.
		</span>
		<button class="button mt-4 mx-auto" on:click={done}>Ok</button>
	</div>
</div>
