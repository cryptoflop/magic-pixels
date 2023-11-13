import { StringSink } from "./StringSink";

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
					balances.balances.set(id, parseInt(amount) as u32);
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
			sink.write(id + "=" + amount + ";");
		}
		
		return sink.toString();
	}

}