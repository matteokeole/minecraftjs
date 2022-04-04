import {Component} from "./Component.js";

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

	// Text color
	this.color = b.color ?? Color.white;

	// Text shadow
	this.text_shadow = b.text_shadow ?? false;

	// Action callback
	this.action = b.action ?? new Function();

	// Second texture offset
	this.uv_hover = b.uv_hover ?? this.uv;
};