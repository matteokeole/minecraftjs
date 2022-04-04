import {LAYERS, scale} from "./main.js";

export const
	tooltip_elements = [],
	Tooltip = document.createElement("div");

Tooltip.id = "tooltip";
Tooltip.visible = 0;
Tooltip.canvas = document.createElement("canvas");
Tooltip.ctx = Tooltip.canvas.getContext("2d");
Tooltip.toggle = (v = !Tooltip.visible) => {
	Tooltip.visible = Number(v);

	Tooltip.style.opacity = Tooltip.visible;
	Tooltip.canvas.style.opacity = Tooltip.visible;
};
Tooltip.init = () => {
	// For each layer, get the list of components which use a tooltip
	for (let l of LAYERS) {
		let test = Object.values(l.components).some(c => c.tooltip_text);
		// At least one tooltip-component or container type component in this layer
		test && l.canvas.addEventListener("mousemove", e => Tooltip.render(l, e.clientX, e.clientY));
	}
};
Tooltip.render = (l, x, y) => {
	let c = l.get_component_at(x, y);

	if (c && c.tooltip_text) {
		// TODO: Render tooltip text

		Tooltip.style.left = `${x + 9 * scale}px`;
		Tooltip.style.top = `${y - 15 * scale}px`;
		Tooltip.toggle(1);
	} else Tooltip.toggle(0);
};

Tooltip.appendChild(Tooltip.canvas);
document.body.appendChild(Tooltip);