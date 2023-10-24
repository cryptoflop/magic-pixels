import { derived, type Readable, type Writable } from 'svelte/store'

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

export function asyncDerived(stores: any, callback: any, initial_value?: any) {
	let guard: any

	return derived(stores, ($stores, set) => {
		const inner = guard = {}

		set(initial_value)
		Promise.resolve(callback($stores)).then(value => {
			if (guard === inner) {
				set(value)
			}
		})
	}, initial_value)
}

export function asyncDerivedConst(stores: any, callback: any, initial_value: any) {
	let previous = 0

	return derived(stores, ($stores, set) => {
		const start = Date.now()
		Promise.resolve(callback($stores)).then(value => {
			if (start > previous) {
				previous = start
				set(value)
			}
		})
	}, initial_value)
}
