import { createAudio } from "../helpers/audio";

import clickSrc from "../assets/click.mp3"
import clackSrc from "../assets/clack.mp3"
import { onDestroy, onMount } from "svelte";

export default function hookButtonAudioQues() {
	const click = createAudio(clickSrc, { volume: 0.1 });
	const clack = createAudio(clackSrc, { volume: 0.1 });

	let last: HTMLElement
	const clickFn = (e: MouseEvent) => {
		const el = (e.target as HTMLElement)
		if (el.tagName === "BUTTON" && el !== last) {
			click.play()
			last = el
		}
		if (last !== el) {
			last = el
		}
	}

	const clackFn = (e: MouseEvent) => {
		if ((e.target as HTMLElement).tagName === "BUTTON") {
			clack.play()
		}
	}

	onMount(() => {
		document.addEventListener("mouseover", clickFn)
		document.addEventListener("mousedown", clackFn)
	})

	onDestroy(() => {
		document.removeEventListener("mouseover", clickFn)
		document.removeEventListener("mousedown", clackFn)
	})
}