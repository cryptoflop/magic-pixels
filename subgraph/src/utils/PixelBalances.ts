import { StringSink } from "./StringSink";

function padId(id: string): string {
	return (id + "00000000").substring(0, 8);
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

export class PixelBalances {

	public static fromString(data: string): PixelBalances {
		const balances = new PixelBalances()

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
					balances.balances.set(padId(id), parseInt(amount) as u32);
					id = "";
					amount = "";
					parseId = true;
				} else {
					amount += char;
				}
			}
		}

		return balances;
	}

	private balances: Map<string, u32>;

	constructor() {
		this.balances = new Map<string, u32>();
	}

	increment(id: string): void {
		const balance = this.balances.has(id) ? this.balances.get(id) : 0
		this.balances.set(id, balance + 1)
	}

	decrement(id: string): void {
		const balance = this.balances.get(id) || 0
		if (balance == 1) {
			this.balances.delete(id)
		} else {
			this.balances.set(id, balance - 1)
		}
	}

	toString(): string {
		const keys = this.balances.keys();
		const sink = StringSink.withCapacity(keys.length * 14);

		for (let i = 0; i < keys.length; i++) {
			const id = keys[i];
			const amount = this.balances.get(id).toString();
			sink.write(unpadId(id) + "=" + amount + ";");
		}
		
		return sink.toString();
	}

}