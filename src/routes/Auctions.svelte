<script lang="ts">
  import { getContext } from "svelte";
  import type { createWeb3Ctx } from "../contexts/web3";
  import { fullPixelName, rndPixel } from "../helpers/color-utils";
  import Pixel from "../elements/Pixel.svelte";
  import { tooltip } from "../directives/tooltip";
  import { rndBtwn } from "../helpers/utils";

  const web3 = getContext<ReturnType<typeof createWeb3Ctx>>("web3");

  let view: "search" | "trades" = "trades";

  let trades = Array(12)
    .fill(1)
    .map(() => ({
      seller: "0x123",
      buyer: undefined,
      price: "0.1",
      pixels: Array(rndBtwn(1, 100))
        .fill(1)
        .map(() => rndPixel()),
    }));
</script>

<div class="grid grid-rows-[min-content,1fr] m-auto gap-4">
  <div class="flex justify-around">
    <button class="opacity-50 {view == 'search' && 'underline'}" use:tooltip={"Coming soon!"}>Search</button>
    <button class="button {view == 'trades' && 'underline'}" on:click={() => (view = "trades")}>Trades</button>
  </div>

  {#if view == "trades"}
    <div class="border-2 grid gap-4 p-4 overflow-y-auto max-h-[60vh]">
      {#each trades as trade}
        <div class="grid border-2">
          <div class="px-4 py-2.5 flex">
            <div>Seller: You</div>
            {#if trade.buyer}
              <div class="pl-2">| Buyer: {trade.buyer}</div>
            {/if}
            <div class="ml-auto">Price: {trade.price} eth |</div>
            <button class="pl-2 button" use:tooltip={"Copy the link to this trade."}>Share</button>
          </div>

          <div class="grid grid-cols-[repeat(16,1fr)] pt-0.5 p-4">
            {#each trade.pixels as pxl}
              <div class="relative">
                <Pixel class="h-6 w-6" pixel={pxl} />
                <div class="absolute inset-0" use:tooltip={fullPixelName(pxl)} />
              </div>
            {/each}
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>
