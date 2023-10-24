<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { tooltip } from "../directives/tooltip";
  import { MAX_PIXEL, pixelColor, pixelName } from "../helpers/color-utils";

  const dispatch = createEventDispatcher();

  let className = "";
  export { className as class };

  let selectedExtern: { [key: number]: boolean } = {};
  export { selectedExtern as selected };

  let selected: { [key: number]: boolean } = { ...selectedExtern };

  function select(idx: number) {
    if (selected[idx]) {
      delete selected[idx];
    } else {
      selected[idx] = true;
    }
    selected = { ...selected };
  }

  function done() {
    dispatch("onselect", {
      selected,
    });
  }
</script>

<div class="absolute border-2 {className}">
  <div class="grid grid-cols-9">
    {#each Array(MAX_PIXEL) as _, i}
      {#if i > 0}
        <button
          on:mousedown={() => select(i)}
          class="h-5 w-5 border-hover-blackandwhite {selected[i] && 'border-blackandwhite'}"
          use:tooltip={pixelName(i)}
          style="background-color: {pixelColor(i)}"
        />
      {/if}
    {/each}
  </div>

  <div class="flex mx-2">
    <div>Selected: {Object.keys(selected).length}</div>
    <div class="mr-auto">
      &ensp;(<span on:click={() => (selected = {})} class="button">Clear</span>)
    </div>

    <button class="button" on:click={done}>Ok</button>
  </div>
</div>
