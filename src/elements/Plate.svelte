<script lang="ts">
  import { pixelsToSvg } from "../helpers/color-utils";

  let className = "";
  export { className as class };

  export let plate: { pixels: number[][]; delays: number[][] };
</script>

<img class={className} src={plate && pixelsToSvg(plate.pixels, plate.delays)} />
