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

/**
 * Search for a button at the specified coordinates on the layer and render the button if it is found, false otherwise.
 * @param	{object}	l	The layer where to search
 * @param	{number}	x	The X position
 * @param	{number}	y	The Y position
 */
Button.locate = (l, x, y) => {
	for (let b of l.buttons) {
		if (
			x >= b.x		&&	// Left side
			x < b.x + b.w	&&	// Right side
			y >= b.y		&&	// Top side
			y <= b.y + b.h		// Bottom side
		) return b;
	}

	return false;
};

/**
 * Draw a button.
 * @param	{object}	b	The button to be drawed
 */
Button.render = b => {
	let ctx = b.layer.ctx,
		ox = b.x + (b.w - b.text_size[0]) / 2,
		x = ox,
		y = b.y + (b.h - b.text_size[1]) / 2 + (scale / 2);

	// Clear old text data
	b.char_data = [];

	for (let c of b.text) {
		let i = Font.chars.indexOf(c),
			u = i % 16 * 8,
			v = 8 * (Math.floor(i / 16) + 2);

		b.char_data.push({
			x: x,
			u: u,
			v: v,
		});

		x += ((Font.size[c] ?? 5) + 1) * scale;
	}

	// Reset X position
	x = ox;

	// Draw text shadow (disabled buttons also have it)
	for (let c of b.char_data) {
		ctx.drawImage(
			TEXTURES["font/ascii.png"],
			c.u,
			c.v,
			6,
			8,
			c.x + scale, // Slight text shadow offset
			y + scale, // Slight text shadow offset
			6 * scale,
			8 * scale,
		);
	}

	ctx.globalCompositeOperation = "source-atop";

	// Change text shadow color
	ctx.fillStyle = "#000000c0";
	ctx.fillRect(
		x,
		y,
		b.text_size[0],
		b.text_size[1] + scale,
	);

	ctx.globalCompositeOperation = "source-over";

	// Draw text value
	for (let c of b.char_data) {
		ctx.drawImage(
			TEXTURES["font/ascii.png"],
			c.u,
			c.v,
			6,
			8,
			c.x,
			y,
			6 * scale,
			8 * scale,
		);
	}

	// Darken the text color and shadow for disabled buttons
	if (b.disabled) {
		ctx.globalCompositeOperation = "source-atop";

		ctx.fillStyle = "#0000005f";
		ctx.fillRect(
			x,
			y,
			b.text_size[0],
			b.text_size[1],
		);
	}

	let uv = b.hovered ? b.uv_hover : b.uv,
		w2 = b.size[0] / 2,
		w2_scaled = b.w / 2;

	ctx.globalCompositeOperation = "destination-over";

	// Draw background left part
	ctx.drawImage(
		TEXTURES[b.texture],
		uv[0],
		uv[1],
		w2,
		b.size[1],
		b.x,
		b.y,
		w2_scaled,
		b.h,
	);

	// Draw background right part
	ctx.drawImage(
		TEXTURES[b.texture],
		uv[0] + (200 - w2),
		uv[1],
		w2,
		b.size[1],
		b.x + w2_scaled,
		b.y,
		w2_scaled,
		b.h,
	);

	// Reset global composite operation for future drawings
	ctx.globalCompositeOperation = "source-over";
};