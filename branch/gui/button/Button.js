import {Component} from "./Component.js";
import {TEXTURES, Font, Color, scale} from "./main.js";

export const Button = function(b) {
	Component.call(this, b);

	// Type
	this.type = "button";

	// Hover attribute
	this.hovered = false;

	// Text size
	this.text_size = [];

	// Text value
	this.text = b.text ?? "";

	// Disabled attribute
	this.disabled = b.disabled ?? false;

	// Text color
	this.color = this.disabled ? "#a0a0a0" : Color.black;

	// Text shadow
	this.text_shadow = !this.disabled;

	// Action callback
	this.action = b.action ?? new Function();

	// Default texture offset
	this.uv = this.disabled ? [0, 46] : [0, 66];

	// Second texture offset
	this.uv_hover = this.disabled ? [0, 46] : [0, 86];

	// Texture file
	this.texture = "gui/widgets.png";

	// Tooltip text value
	this.tooltip_text = b.tooltip_text;
};

Button.render = b => {
	let l = b.layer,
		ox = b.x + (b.w - b.text_size[0]) / 2,
		oy = b.y + (b.h - b.text_size[1]) / 2 + (scale / 2),
		x = ox,
		y = oy;

	for (let ch of b.text) {
		let i = Font.chars.indexOf(ch),
			u = i % 16 * 8,
			v = 8 * (Math.floor(i / 16) + 2);

		if (b.text_shadow) {
			l.ctx.globalAlpha = .43;
			l.ctx.drawImage(
				TEXTURES["font/ascii.png"],
				u,
				v,
				6,
				8,
				x + scale,
				oy + scale,
				6 * scale,
				8 * scale,
			);
		}

		l.ctx.globalAlpha = 1;
		l.ctx.drawImage(
			TEXTURES["font/ascii.png"],
			u,
			v,
			6,
			8,
			x,
			oy,
			6 * scale,
			8 * scale,
		);

		x += ((Font.size[ch] ?? 5) + 1) * scale;
	}

	l.ctx.globalCompositeOperation = "source-atop";
	l.ctx.fillStyle = b.disabled ? b.color : Color.black;
	l.ctx.fillRect(
		ox,
		oy,
		b.text_size[0],
		b.text_size[1] + (b.text_shadow ? scale : 0),
	);
	l.ctx.globalAlpha = 1;
	l.ctx.globalCompositeOperation = "source-over";

	if (!b.disabled) {
		x = ox;
		for (let ch of b.text) {
			let i = Font.chars.indexOf(ch),
				u = i % 16 * 8,
				v = 8 * (Math.floor(i / 16) + 2);

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
	}

	// The button is drawn in 2 parts, depending on its width
	let uv = b.hovered ? b.uv_hover : b.uv,
		w2 = b.size[0] / 2;
	l.ctx.globalCompositeOperation = "destination-over";
	l.ctx.drawImage(
		TEXTURES[b.texture],
		uv[0],
		uv[1],
		w2,
		b.size[1],
		b.x,
		b.y,
		b.w / 2,
		b.h,
	);
	l.ctx.drawImage(
		TEXTURES[b.texture],
		uv[0] + (200 - w2),
		uv[1],
		w2,
		b.size[1],
		b.x + (b.w / 2),
		b.y,
		b.w / 2,
		b.h,
	);
	l.ctx.globalCompositeOperation = "source-over";
};