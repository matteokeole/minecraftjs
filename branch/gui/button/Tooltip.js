import {LAYERS, WINDOW, TEXTURES, Font, scale} from "./main.js";
import {compute_text} from "../../../assets/js/functions/compute_text.js";

export const
	tooltip_elements = [],
	Tooltip = document.createElement("div");

Tooltip.id = "tooltip";
Tooltip.visible = 0;
Tooltip.canvas = document.createElement("canvas");
Tooltip.text = {};

Tooltip.toggle = (v = !Tooltip.visible) => {
	Tooltip.visible = Number(v);

	Tooltip.style.opacity = Tooltip.visible;
	Tooltip.canvas.style.opacity = Tooltip.visible;
};

Tooltip.init = () => {
	Tooltip.canvas.width = WINDOW.MW;
	Tooltip.canvas.height = WINDOW.MH;

	Tooltip.ctx = Tooltip.canvas.getContext("2d");
	Tooltip.ctx.imageSmoothingEnabled = false;

	// For each layer, get the list of components which use a tooltip
	for (let l of LAYERS) {
		let test = Object.values(l.components).some(c => c.tooltip_text);

		// At least one tooltip-component or container type component in this layer
		test && l.canvas.addEventListener("mousemove", e => Tooltip.update(l));
	}
};

Tooltip.update = l => {
	let c = l.get_component_at(WINDOW.X, WINDOW.Y);

	if (c && c.tooltip_text) {
		Tooltip.style.left = `${WINDOW.X + 9 * scale}px`;
		Tooltip.style.top = `${WINDOW.Y - 15 * scale}px`;

		if (!Tooltip.visible) {
			Tooltip.toggle(1);
			if (Tooltip.text.raw !== c.tooltip_text) {
				Tooltip.erase();
				Tooltip.render(c);
			}
		}
	} else if (Tooltip.visible) Tooltip.toggle(0);
};

Tooltip.erase = () => {
	Tooltip.ctx.clearRect(0, 0, Tooltip.width, Tooltip.height);
};

/**
 * Print the component text value on the tooltip.
 * @param	{string}	c	The component to be printed
 */
Tooltip.render = c => {
	let ctx = Tooltip.ctx,
		text = compute_text(c.tooltip_text),
		w = 6 * scale,
		h = 8 * scale;

	Tooltip.text = text.raw;

	// Resize tooltip
	Tooltip.width = text.max_width;
	Tooltip.height = text.max_height;
	Tooltip.style.width = `${Tooltip.width}px`;
	Tooltip.style.height = `${Tooltip.height}px`;

	// Draw text shadow
	for (let c of Tooltip.text) {
		ctx.drawImage(
			TEXTURES["font/ascii.png"],
			c.u,
			c.v,
			6,
			8,
			c.x + scale, // Text shadow offset
			c.y + scale, // Text shadow offset
			w,
			h,
		);
	}

	// Change text shadow color
	ctx.fillStyle = "#000000c0";
	ctx.fillRect(0, 0, Tooltip.width, Tooltip.height);

	// Draw text value
	for (let c of Tooltip.text) {
		ctx.drawImage(
			TEXTURES["font/ascii.png"],
			c.u,
			c.v,
			6,
			8,
			c.x,
			c.y,
			w,
			h,
		);
	}

	// Darken the text color
	ctx.fillStyle = "#00000003";
	ctx.fillRect(0, 0, Tooltip.width, Tooltip.height);
};

Tooltip.appendChild(Tooltip.canvas);
document.body.appendChild(Tooltip);