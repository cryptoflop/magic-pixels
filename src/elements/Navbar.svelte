<script lang="ts">
  const views = ["Nether", "Forge", "Treasury", "Auctions"];

  export let view = views[3];
</script>

<div class="flex space-x-6 mx-auto select-none text-lg">
  {#each views as v}
    <button class="button {v == view && 'underline'}" on:click={() => (view = v)}>{v}</button>
  {/each}
</div>
