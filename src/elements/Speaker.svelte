<script lang="ts">
  import { useAudioState } from "../helpers/audio";

  let [muted, setMuted] = useAudioState((m) => (muted = m));
</script>

<div class="absolute left-2 top-2">
  <button on:click={() => setMuted(!muted)} class="relative p-2">
    <i class="volume" />

    {#if muted}
      <div class="absolute inset-0 bg-black/50">
        <i class="volume-slash" />
      </div>
    {/if}
  </button>
</div>
