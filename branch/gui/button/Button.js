import {Component} from "./Component.js";
import {SOURCES, Color} from "./main.js";

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
	this.color = this.disabled ? Color.gray : Color.black;

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
	SOURCES.push(this.texture);
};