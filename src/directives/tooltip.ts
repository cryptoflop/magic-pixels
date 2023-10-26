import Tooltip from '../elements/Tooltip.svelte';

let current: Tooltip | null

window.addEventListener("mousemove", (e) => {
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

export function tooltip(element: HTMLElement, title: string) {
	function mouseOver(event: { pageX: any; pageY: any; }) {
		if (current) current.$destroy();

		current = new Tooltip({
			props: {
				title: title,
				x: event.pageX,
				y: event.pageY,
			},
			target: document.body,
		});
		current.el = element;
	}

	element.addEventListener('mouseover', mouseOver);

	return {
		update(newValue: string) {
			title = newValue;
			if (current?.el === element) {
				current.$set({ title })
			}
		},
		destroy() {
			element.removeEventListener('mouseover', mouseOver);
		}
	}
}