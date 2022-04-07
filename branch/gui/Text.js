import {Component} from "./Component.js";
import {TEXTURES, Font, Color, scale} from "./main.js";
import {compute_text} from "../../assets/js/functions/compute_text.js";

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
	let ctx = t.layer.ctx,
		text = compute_text(t.text),
		x = t.x + scale,
		y = t.y + scale,
		w = 6 * scale,
		h = 8 * scale;

	// Draw text shadow
	for (let c of text.raw) {
		ctx.drawImage(
			TEXTURES["font/ascii.png"],
			c.u,
			c.v,
			6,
			8,
			x + c.x + scale, // Text shadow offset
			y + c.y + scale, // Text shadow offset
			w,
			h,
		);
	}

	ctx.globalCompositeOperation = "source-atop";

	// Set the text shadow color
	ctx.fillStyle = "#000000c0";
	ctx.fillRect(x, y, text.max_width, text.max_height);

	ctx.globalCompositeOperation = "source-over";

	// Draw text value
	for (let c of text.raw) {
		ctx.drawImage(
			TEXTURES["font/ascii.png"],
			c.u,
			c.v,
			6,
			8,
			x + c.x,
			y + c.y,
			w,
			h,
		);
	}

	ctx.globalCompositeOperation = "source-atop";

	// Set the text color
	ctx.fillStyle = "#000000a0";
	ctx.fillRect(x, y, text.max_width, text.max_height);
	ctx.fillStyle = `${Color.red}a0`;
	ctx.fillRect(x, y, text.max_width, text.max_height);
};

// #fc5454
// #3e1515