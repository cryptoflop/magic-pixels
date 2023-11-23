import Tooltip from '../elements/Tooltip.svelte';

let current: Tooltip | null
let currentEl: HTMLElement
let currX = 0, currY = 0;

window.addEventListener("mousemove", (e) => {
	currentEl = e.target! as HTMLElement;
	currX = e.pageX, currY = e.pageY;
	if (!current) return;

	if (e.target !== current.el) {
		current.$destroy();
		current = null
		return;
	}

	current.$set({
		x: e.pageX,
		y: e.pageY,
	})
})

export function tooltip(element: HTMLElement, title: string | null) {
	function show(x: number, y: number) {
		current?.$destroy();
		current = new Tooltip({
			props: {
				title: title!,
				x: x,
				y: y,
			},
			target: document.body,
		});
		current.el = element;
	}

	function mouseOver(event: { pageX: any; pageY: any; }) {
		if (!title) return;
		if (current) current.$destroy();

		show(event.pageX, event.pageY)
	}

	element.addEventListener('mouseover', mouseOver);

	return {
		update(newValue: string | null) {
			title = newValue;
			if (current?.el === element) {
				if (newValue) {
					current.$set({ title: newValue })
				} else {
					current.$destroy();
					current = null
				}
			} else {
				if (currentEl === element) {
					show(currX, currY)
				}
			}
		},
		destroy() {
			element.removeEventListener('mouseover', mouseOver);
		}
	}
}