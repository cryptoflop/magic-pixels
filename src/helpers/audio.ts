import { onDestroy } from 'svelte'

let muted = !!localStorage.getItem('muted')
const audioEls: HTMLAudioElement[] = []

const blockedAutoplays: HTMLAudioElement[] = []
document.onclick = () => {
	blockedAutoplays.forEach(ae => {
		ae.play()
	})
	blockedAutoplays.splice(0, blockedAutoplays.length)
}

window.onblur = () => {
	if (muted) return
	if (document.activeElement instanceof HTMLIFrameElement) return
	audioEls.forEach(ae => ae.muted = true)
}

window.onfocus = () => {
	if (muted) return
	audioEls.forEach(ae => ae.muted = false)
}


export function setAudioMuted(isMuted: boolean) {
	muted = isMuted
	audioEls.forEach(ae => ae.muted = true)
}

export function useAudioState(onchange?: (m: boolean) => void) {
	return [muted, (isMuted: boolean) => {
		if (isMuted) {
			localStorage.setItem('muted', 'true')
		} else {
			localStorage.removeItem('muted')
		}
		muted = isMuted
		// TODO: make this handle all onchange handlers
		onchange?.(muted)
		audioEls.forEach(ae => ae.muted = isMuted)
	}] as const
}

export function createAudio(src: string,
	options: { volume?: number, loop?: boolean, playbackRate?: number, autoPlay?: boolean, disposable?: boolean }
) {
	options = { ...{ volume: 0.5, loop: false, playbackRate: 1, autoPlay: false, disposable: false }, ...options }
	const audio = new Audio(src)
	audio.volume = options.volume!
	audio.playbackRate = options.playbackRate!
	audio.loop = options.loop!
	audio.muted = muted

	if (options.autoPlay!) {
		audio.play().catch(() => blockedAutoplays.push(audio))
	}

	audioEls.push(audio)

	if (options.disposable) {
		audio.addEventListener('ended', () => {
			// remove audio element after playback ended
			audioEls.splice(audioEls.indexOf(audio), 1)
		})
	} else {
		onDestroy(() => {
			audio.pause()
			// remove audio element when reactive context is cleaned up
			audioEls.splice(audioEls.indexOf(audio), 1)
		})
	}

	return { ...audio, play: () => { audio.play().catch(() => void 0) } }
}