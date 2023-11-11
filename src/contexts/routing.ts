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

	type Param = { [key: string]: string }

	function formatParam(param: Param) {
		const sp = new URLSearchParams()
		for (const k in param) {
			sp.set(k, param[k])
		}
		return '?' + sp.toString()
	}

	function parseParam(sp: URLSearchParams) {
		const param: Param = {}
		for (const e of sp) {
			param[e[0]] = e[1]
		}
		return param
	}

	const ctx = {
		root: cachedStore(writable<string>()),
		route: cachedStore(writable<string>()),
		param: cachedStore(writable<Param | undefined>()),

		routeComponent: readable<ComponentType>(undefined, (set) => {
			const unsub = ctx.route.subscribe(r => {
				set(routes[r])
			}) as () => void;

			return () => unsub();
		}),

		goto(route: string, param?: Param, root?: string) {
			window.history.pushState(param, route, (`/${root ?? ctx.root.current}${root == route ? '' : ('/' + route)}`) + (param ? formatParam(param) : ''))
			if (root) ctx.root.set(root)
			ctx.route.set(route)
			ctx.param.set(param)
			navigations++
		},

		goback() {
			if (navigations > 0) {
				window.history.back()
			} else {
				const [_, root, route] = window.location.pathname.split('/')
				if (route) {
					// we can "move back" to root since we are under root/route
					ctx.goto(root, undefined, root)
				}
			}
		}
	}

	function stateFromUrl() {
		const [_, root, route] = window.location.pathname.split('/')
		const param = window.location.search
		ctx.root.set(root)
		ctx.param.set(param ? parseParam(new URLSearchParams(param)) : undefined)
		ctx.route.set(route || root)
	}

	if (window.location.pathname.length > 1) {
		stateFromUrl()
	} else {
		ctx.root.set(index)
		ctx.route.set(index)
		window.history.replaceState(undefined, index, index)
	}

	window.onpopstate = () => {
		stateFromUrl()
		navigations--
	};

	return ctx
}