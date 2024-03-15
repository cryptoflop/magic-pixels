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
			const sp = new URLSearchParams(window.location.search)
			if (params) Object.keys(params).forEach(key => sp.set(key, params[key]))
			if (route !== undefined && root !== route) sp.set("route", route!)
			sp.set("root", root)

			window.history.pushState(params, root + route, '?' + sp.toString())
			ctx.params.set(params)
			ctx.root.set(root)
			ctx.route.set(route)
			navigations++
		},

		goback() {
			if (navigations > 0) {
				window.history.back()
			} else {
				const sp = new URLSearchParams(window.location.search)
				if (sp.has("route")) {
					// we can "move back" to root since we are under root/route
					ctx.goto(sp.get("root")!)
				}
			}
		}
	}

	function stateFromUrl() {
		const sp = new URLSearchParams(window.location.search)
		ctx.params.set(Object.fromEntries(sp.entries()))
		ctx.root.set(sp.get("root") ?? index)
		ctx.route.set(sp.get("route") || sp.get("root") || index)

		if (!sp.has("root")) {
			sp.set("root", index)
			window.history.replaceState({}, index, '?' + sp.toString())
		}
	}

	stateFromUrl()

	window.onpopstate = () => {
		stateFromUrl()
		navigations--
	};

	return ctx
}