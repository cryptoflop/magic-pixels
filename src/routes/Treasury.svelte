<script lang="ts">
  import PixelPalette from "../elements/PixelPalette.svelte";
  import Plate from "../elements/Plate.svelte";
  import { getContext } from "svelte";
  import type { createWeb3Ctx } from "../contexts/web3";

  const web3 = getContext<ReturnType<typeof createWeb3Ctx>>("web3");
  const pixels = web3.pixels;
  const plates = web3.plates;

  let view: "pixels" | "plates" = "plates";
</script>

<div class="grid grid-rows-[min-content,1fr] m-auto gap-4">
  <div class="flex justify-around">
    <button class="button {view == 'pixels' && 'underline'}" on:click={() => (view = "pixels")}>Pixels</button>
    <button class="button {view == 'plates' && 'underline'}" on:click={() => (view = "plates")}>Plates</button>
  </div>

  {#if view == "pixels"}
    <PixelPalette pixels={$pixels} cols={12} />
  {/if}

  {#if view == "plates"}
    <div class="border-2 grid grid-cols-2 gap-4 p-4 overflow-y-auto h-[314px] max-h-[314px]">
      {#each $plates as plate}
        <div class="border-2 cursor-pointer">
          <Plate class="w-32" {plate} />
        </div>
      {/each}
      {#if $plates.length == 0}
        <div class="text-xs opacity-60 absolute w-64 text-center p-4 ml-6">No plates</div>
        <div class="w-32" />
      {/if}
    </div>
  {/if}
</div>
