import { decodePixel } from "../../contracts/scripts/libraries/pixel-parser"

export default class PixelBalances {
	static fromString(data: string) {
		return new PixelBalances(new Map(JSON.parse(data)))
	}

	private balances

	constructor(balances = new Map<PixelId, number>()) {
		this.balances = balances
	}

	private _get(id: PixelId) {
		return this.balances.get(id) ?? 0
	}

	toString() {
		return JSON.stringify(Array.from(this.balances.entries()))
	}

	get(id: PixelId) {
		return this._get(id)
	}

	set(id: PixelId, balance: number) {
		this.balances.set(id, balance)
	}

	increase(id: PixelId) {
		this.balances.set(id, this._get(id) + 1)
	}

	decrease(id: PixelId) {
		this.balances.set(id, this._get(id) - 1)
		if (this._get(id) < 0) throw `Negative balance: ${decodePixel(id)}`
	}

	toArray() {
		return Array.from(this.balances.entries()).reduce((prev, curr) => {
			const id = curr[0]
			for (let i = 0; i < curr[1]; i++) prev.push(id)
			return prev
		}, [] as PixelId[])
	}

	copy(deep = false) {
		return deep ? PixelBalances.fromString(this.toString()) : new PixelBalances(this.balances)
	}

}