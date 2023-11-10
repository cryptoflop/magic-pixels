import { type ComponentType } from "svelte";
import { writable } from "svelte/store";
import Toast from "../elements/Toast.svelte";

export function createToastCtx() {

	const ctx = {
		current: writable<{ component: ComponentType, props: object } | null>(null),

		show(componentOrText: ComponentType | string, props: object = {}) {
			if (typeof componentOrText === "string") {
				ctx.current.set({ component: Toast, props: { text: componentOrText } })
			} else {
				ctx.current.set({ component: componentOrText, props })
			}
		},

		close() {
			ctx.current.set(null)
		}
	}

	return ctx
}