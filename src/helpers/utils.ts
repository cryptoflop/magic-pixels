export function rndBtwn(min: number, max: number) {
	return Math.max(min, Math.floor(Math.random() * (max - min + 1) + min))
}
