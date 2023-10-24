<script lang="ts">
  function done(e: MouseEvent) {
    localStorage.setItem("intro", "true");
    (e.target as HTMLElement).parentElement!.parentElement!.remove();
  }
</script>

<div class="absolute inset-0 bg-black/50 grid z-10">
  <div class="grid p-4 relative bg-black m-auto border-2 border-white/60">
    <h1 class="text-xl mx-auto mb-2">Welcome to the Nether!</h1>
    <span>Conjure pixels from the nether in order to forge them into a plate.</span>
    <span>There is a small chance to find some ether while conjuring as well.</span>
    <button class="button mt-4 mx-auto" on:click={done}>Ok</button>
  </div>
</div>
