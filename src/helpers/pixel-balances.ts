import { decodePixel } from "../../contracts/scripts/libraries/pixel-parser"

export default class PixelBalances {
	static fromString(data: string) {
		return new PixelBalances(new Map(JSON.parse(data)))
	}

	private balances

	private _total = 0
	public get total() {
		return this._total;
	}

	constructor(balances = new Map<PixelId, number>()) {
		this.balances = balances
		this._total = Array.from(balances.values()).reduce((p, c) => p + c, 0)
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
		this._total++
	}

	decrease(id: PixelId) {
		this.balances.set(id, this._get(id) - 1)
		if (this._get(id) < 0) throw `Negative balance: ${decodePixel(id)}`
		this._total--
	}

	toArray() {
		const pixelIds: PixelId[] = []
		for (const entry of this.balances.entries()) {
			for (let i = 0; i < entry[1]; i++)
				pixelIds.push(entry[0])
		}
		return pixelIds
	}

	toSectionArray(cursor: number, length: number) {
		// TODO
	}

	copy(deep = false) {
		return deep ? PixelBalances.fromString(this.toString()) : new PixelBalances(this.balances)
	}

}