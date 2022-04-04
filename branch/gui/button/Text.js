import {Component} from "./Component.js";
import {TEXTURES, Font, Color, scale} from "./main.js";

export const Text = function(t) {
	Component.call(this, t);

	// Type
	this.type = "text";

	// Size (will be calculated on the computing)
	this.size = [];

	// Text value
	this.text = t.text ?? "";	

	// Text color
	this.color = t.color ?? Color.white;

	// Text shadow
	this.text_shadow = t.text_shadow ?? false;
};

Text.render = t => {
	let l = t.layer,
		x = t.x + scale,
		y = t.y + scale;

	for (let line of t.lines) {
		for (let ch of line) {
			let i = Font.chars.indexOf(ch),
				u = i % 16 * 8,
				v = 8 * (Math.floor(i / 16) + 2);

			if (t.text_shadow) {
				l.ctx.globalAlpha = .43;
				l.ctx.drawImage(
					TEXTURES["font/ascii.png"],
					u,
					v,
					6,
					8,
					x + scale,
					y + scale,
					6 * scale,
					8 * scale,
				);
				l.ctx.globalAlpha = 1;
			}

			l.ctx.drawImage(
				TEXTURES["font/ascii.png"],
				u,
				v,
				6,
				8,
				x,
				y,
				6 * scale,
				8 * scale,
			);

			x += ((Font.size[ch] ?? 5) + 1) * scale;
		}

		x = t.x + scale;
		y += 9 * scale;
	}
};