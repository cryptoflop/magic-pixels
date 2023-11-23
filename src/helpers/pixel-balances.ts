import { encodePixel } from "../../contracts/scripts/libraries/pixel-parser";

function padId(id: string): string {
	return (id + "0000").substring(0, 4);
}

function unpadId(id: string): string {
	let idx = 1;
	for (let i = id.length - 1; i > 0; i--) {
		if (id[i] != "0") {
			idx = i + 1;
			break;
		}
	}
	return id.substring(0, idx);
}

export default class PixelBalances {
	static fromString(data: string) {
		const balances = new Map<PixelId, number>()

		let id = "";
		let amount = "";
		let parseId = true;
		for (let i = 0; i < data.length; i++) {
			const char = data[i];
			if (parseId) {
				if (char == "=") {
					parseId = false;
				} else {
					id += char;
				}
			} else {
				if (char == ";") {
					balances.set(`0x${padId(id)}`, parseInt(amount));
					id = "";
					amount = "";
					parseId = true;
				} else {
					amount += char;
				}
			}
		}

		return new PixelBalances(balances)
	}

	static fromIds(ids: PixelId[]) {
		const balances = new PixelBalances()

		for (const id of ids) {
			balances.increase(id)
		}

		return balances
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
		const amount = this._get(id)
		if (amount > 1) {
			this.balances.set(id, amount - 1)
		} else {
			this.balances.delete(id)
		}
		this._total--
	}

	has(pixels: Pixel[]): boolean
	has(pixels: PixelId[]): boolean
	has(pixels: PixelBalances): boolean
	has(pixels: Pixel[] | PixelId[] | PixelBalances): boolean {
		let b: PixelBalances;
		if (pixels instanceof Array) {
			b = new PixelBalances();
			if (typeof pixels[0] === "string") {
				pixels.forEach(id => b.increase(id as PixelId))
			} else {
				pixels.forEach(pxl => b.increase(encodePixel(pxl as Pixel)))
			}
		} else {
			b = pixels;
		}

		for (const entry of b.balances.entries()) {
			if (this.get(entry[0]) < entry[1]) {
				return false;
			}
		}

		return true;
	}

	toString() {
		let result = "";

		for (const id of this.balances.keys()) {
			const amount = this.balances.get(id)!.toString();
			result += unpadId(id.substring(2)) + "=" + amount + ";";
		}

		return result;
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