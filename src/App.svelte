<script lang="ts">
	import Navbar from "./elements/Navbar.svelte";
	import Background from "./elements/Background.svelte";
	import Speaker from "./elements/Speaker.svelte";
	import { getContext, onMount, setContext } from "svelte";
	import { createWeb3Ctx } from "./contexts/web3";
	import { createRoutingCtx } from "./contexts/routing";
	import { createToastCtx } from "./contexts/toast";
	import { createAudio } from "./helpers/audio";
	import Wallet from "./elements/Wallet.svelte";
	import Intro from "./elements/Intro.svelte";
	import Web3State from "./elements/Web3State.svelte";
	import ToastOutlet from "./elements/ToastOutlet.svelte";
	import DiscordLink from "./elements/DiscordLink.svelte";
	import ChainSelector from "./elements/ChainSelector.svelte";
	import hookButtonAudioQues from "./directives/buttonaudioque";
	
	import atmosphereSrc from "./assets/sounds/atmoshpere.mp3";

	createAudio(atmosphereSrc, { autoPlay: true, loop: true, volume: 0.1 });

	hookButtonAudioQues();

	const toast = createToastCtx();
	setContext("toast", toast);

	onMount(() => {
		if (!localStorage.getItem("intro")) toast.show(Intro);
	});

	setContext("web3", createWeb3Ctx());

	setContext("routing", createRoutingCtx());
	const routing = getContext<ReturnType<typeof createRoutingCtx>>("routing");
	const routeCompontent = routing.routeComponent;
</script>

<main class="h-screen w-screen relative grid grid-rows-[min-content,1fr] pt-4">
	<Background />

	<Speaker />
	<Navbar />
	<ChainSelector />
	<Wallet />

	<outlet id="outlet" class="grid">
		<svelte:component this={$routeCompontent} />
	</outlet>

	<ToastOutlet />

	<DiscordLink />
	<Web3State />
</main>
