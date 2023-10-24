<script lang="ts">
  import Nether from "./routes/Nether.svelte";
  import Forge from "./routes/Forge.svelte";
  import Navbar from "./elements/Navbar.svelte";
  import Treasury from "./routes/Treasury.svelte";
  import Background from "./elements/Background.svelte";
  import Speaker from "./elements/Speaker.svelte";
  import { setContext } from "svelte";
  import { createWeb3Ctx } from "./contexts/web3";
  import { createAudio } from "./helpers/audio";
  import Wallet from "./elements/Wallet.svelte";
  import Intro from "./elements/Intro.svelte";
  import RpcState from "./elements/RPCState.svelte";

  import atmosphereSrc from "./assets/atmoshpere.mp3";
  import discordImg from "./assets/dc.png";
  import Auctions from "./routes/Auctions.svelte";

  let view: string;

  createAudio(atmosphereSrc, { autoPlay: true, loop: true, volume: 0.2 });

  setContext("web3", createWeb3Ctx());
</script>

<main class="h-screen w-screen relative grid grid-rows-[min-content,1fr] pt-4">
  <Background />

  {#if !localStorage.getItem("intro")}
    <Intro />
  {/if}

  <RpcState />

  <a class="absolute bottom-4 left-4" target="_blank" href="https://discord.gg/wQJs3Upf77">
    <img src={discordImg} class="w-4 h-4" />
  </a>

  <Speaker />
  <Navbar bind:view />
  <Wallet />

  {#if view == "Nether"}
    <Nether />
  {:else if view == "Forge"}
    <Forge />
  {:else if view == "Treasury"}
    <Treasury />
  {:else if view == "Auctions"}
    <Auctions />
  {/if}
</main>
