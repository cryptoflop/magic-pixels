<script lang="ts">
  import { getContext } from "svelte";
  import type { createWeb3Ctx } from "../contexts/web3";
  import { tooltip } from "../directives/tooltip";

  const web3 = getContext<ReturnType<typeof createWeb3Ctx>>("web3");
  const acc = web3.account;
</script>

{#if $acc}
  <div class="absolute w-2 h-2 bottom-4 right-4 overflow-visible" use:tooltip={"Connected to mainnet"}>
    <div class="bg-green-500 h-1.5 w-1.5 absolute ml-px mt-px pointer-events-none" />
    <div class="bg-green-500 h-2 w-2 animate-ping pointer-events-none opacity-70" />
  </div>
{:else}
  <div class="absolute w-2 h-2 bottom-4 right-4 overflow-visible" use:tooltip={"Not connected"}>
    <div class="bg-red-500/50 h-1.5 w-1.5 absolute ml-px mt-px pointer-events-none" />
  </div>
{/if}
