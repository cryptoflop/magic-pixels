import { type ComponentType } from "svelte";
import { readable, writable } from "svelte/store";
import { cachedStore } from "../helpers/reactivity-helpers";

import Nether from "../routes/Nether.svelte";
import Forge from "../routes/Forge.svelte";
import Treasury from "../routes/treasury/Treasury.svelte";
import Market from "../routes/market/Market.svelte";
import OpenTrade from "../routes/market/OpenTrade.svelte";
import TradeOutlet from "../routes/market/TradeOutlet.svelte";
import PlateOutlet from "../routes/treasury/PlateOutlet.svelte";

export function createRoutingCtx() {
	const index = 'nether'

	const routes: { [key: string]: ComponentType } = {
		nether: Nether,

		forge: Forge,

		treasury: Treasury,
		plate: PlateOutlet,

		market: Market,
		opentrade: OpenTrade,
		trade: TradeOutlet
	}

	let navigations = 0

	type Params = { [key: string]: string }

	function formatParam(params: { [key: string]: string | undefined }) {
		const sp = new URLSearchParams()
		for (const k in params) {
			if (params[k] !== undefined) {
				sp.set(k, params[k]!)
			}
		}
		return '?' + sp.toString()
	}

	function parseParams(sp: URLSearchParams) {
		const params: Params = {}
		for (const e of sp) {
			params[e[0]] = e[1]
		}
		return params
	}

	const ctx = {
		root: cachedStore(writable<string>()),
		route: cachedStore(writable<string | undefined>()),
		params: cachedStore(writable<Params | undefined>()),

		routeComponent: cachedStore(readable<ComponentType>(undefined, (set) => {
			const update = () => {
				const root = ctx.root.current!
				const route = ctx.route.current
				set(route ? routes[route] : routes[root])
			}
			ctx.root.subscribe(update)
			ctx.route.subscribe(update);
		})),

		goto(root: string, route?: string, params?: Record<string, string>) {
			window.history.pushState(params, root + route, formatParam({
				...params,
				root,
				route: root === route ? undefined : route
			}))
			ctx.params.set(params)
			ctx.root.set(root)
			ctx.route.set(route)
			navigations++
		},

		goback() {
			if (navigations > 0) {
				window.history.back()
			} else {
				const sp = parseParams(new URLSearchParams(window.location.search))
				if (sp.route) {
					// we can "move back" to root since we are under root/route
					ctx.goto(sp.root)
				}
			}
		}
	}

	function stateFromUrl() {
		const sp = parseParams(new URLSearchParams(window.location.search))
		ctx.params.set(sp)
		ctx.root.set(sp.root ?? index)
		ctx.route.set(sp.route || sp.root || index)

		if (!sp.root) {
			window.history.replaceState(sp, index, formatParam({ root: index }))
		}
	}

	stateFromUrl()

	window.onpopstate = () => {
		stateFromUrl()
		navigations--
	};

	return ctx
}