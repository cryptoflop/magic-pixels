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
	import RpcState from "./elements/RPCState.svelte";
	import ToastOutlet from "./elements/ToastOutlet.svelte";

	import atmosphereSrc from "./assets/atmoshpere.mp3";
	import DiscordLink from "./elements/DiscordLink.svelte";

	createAudio(atmosphereSrc, { autoPlay: true, loop: true, volume: 0.1 });

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

	<ToastOutlet />

	<RpcState />

	<DiscordLink />

	<Speaker />
	<Navbar />
	<Wallet />

	<outlet id="outlet" class="grid">
		<svelte:component this={$routeCompontent} />
	</outlet>
</main>
