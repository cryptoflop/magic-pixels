import { type Readable, type Writable } from 'svelte/store'

/**
 * Makes a store cached, meaning it adds a "current" property to the store with the result of the last value emitted
 */
export function cachedStore<T, K extends Readable<T> | Writable<T>>(store: K) {
	let subs = 0
	const obj = {
		...store,
		current: undefined as unknown as Parameters<Parameters<K['subscribe']>[0]>[0],
		subscribe(r: Parameters<K['subscribe']>[0], i?: Parameters<K['subscribe']>[1]) {
			const unsub = store.subscribe(subs == 0 ? function (v) {
				obj.current = v
				r(v)
			} : r, i)
			subs++
			return () => { subs--; unsub() }
		}
	}
	return obj
}

/**
 * Makes a store consistent, meaning after initially subscribed to it will never unsubscribe
 */
export function consistentStore<T, K extends Readable<T> | Writable<T>>(store: K) {
	let init = false
	const obj = {
		...store,
		subscribe(r: Parameters<K['subscribe']>[0], i?: Parameters<K['subscribe']>[1]) {
			if (!init) {
				store.subscribe(() => void 0)
				init = true
			}
			return store.subscribe(r, i)
		}
	}
	return obj
}

/**
 * Makes a store refreshable, meaning it adds a "refresh" method which signals the store to refresh itself
 */
export function refreshableStore<T, K extends Writable<T>>(store: K, refresh: () => Promise<T>, refreshOnInit = false) {
	const obj = {
		...store,
		refresh: () => refresh().then(store.set)
	}
	setTimeout(() => refreshOnInit && obj.refresh(), 1)
	return obj
}