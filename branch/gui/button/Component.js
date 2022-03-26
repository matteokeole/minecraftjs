import {Color} from "./main.js";

/**
 * Construct a new layer component.
 *
 * Param	Type		Name=Default						Description
 * @param	{object}	[component={}]						Component data object
 * @param	{string}	[component.type="default"]			Component type
 * @param	{array}		[component.origin=["left", "top"]]	Component origin
 * @param	{array}		[component.offset=[0, 0]]			Component offset
 * @param	{array}		[component.size=[0, 0]]				Component size
 * @param	{string}	[component.texture]					Component texture file path, if text component the texture will be the font file path
 * @param	{array}		[component.uv=[0, 0]]				Component texture offset
 * @param	{array}		[component.slots=[]]				Component slots
 * @param	{string}	[component.text=""]					Component text value
 * @param	{string}	[component.text_background]			Component text background color (hexadecimal)
 * @param	{number}	[component.text_background_alpha=1]	Component text background alpha value
 * @param	{string}	[component.color=Color.white]		Component text color (hexadecimal)
 * @param	{boolean}	[component.text_shadow=false]		Component text shadow
 */
export function Component(c = {}) {
	// Type
	this.type = c.type ?? "default";

	// Origin
	this.origin = c.origin ?? ["left", "top"];

	// Offset
	this.offset = c.offset ?? [0, 0];

	// Size
	this.size = c.size ?? [0, 0];

	// Texture file path
	this.texture = c.texture;

	// Texture offset
	this.uv = c.uv ?? [0, 0];

	// Attributes that depend on component type
	switch (c.type) {
		case "text":
			// Font file path
			this.texture = "font/ascii.png";

			// Text value
			this.text = c.text ?? "";

			// Text color
			this.color = c.color ?? Color.white;

			// Text shadow
			this.text_shadow = c.text_shadow ?? false;

			// Background color
			this.text_background = c.text_background ?? false;

			// Background opacity
			this.text_background_alpha = c.text_background_alpha ?? 1;

			break;

		case "button":
			// Hover attribute
			this.hovered = false;

			// Text size
			this.text_size = [];

			// Text value
			this.text = c.text ?? "";

			// Text color
			this.color = c.color ?? Color.white;

			// Text shadow
			this.text_shadow = c.text_shadow ?? false;

			// Link
			this.link = c.link ?? "";

			// Second texture offset
			this.uv2 = c.uv2 ?? this.uv;

			break;
	}
}