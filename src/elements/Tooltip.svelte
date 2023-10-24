<script lang="ts">
  export let title: string;
  export let x: number;
  export let y: number;

  let el: HTMLDivElement;
</script>

<div
  bind:this={el}
  class="border-2 bg-black px-2 absolute z-50"
  style="top: {y - 34}px; left: {x - el?.clientWidth - 4}px;"
>
  {title}
</div>
