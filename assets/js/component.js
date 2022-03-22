import {Color} from "./main.js";
export function Component(c = {}) {
	this.type = c.type ?? "default";
	this.origin = c.origin ?? ["left", "top"];
	this.offset = c.offset ?? [0, 0];
	this.size = c.size ?? [0, 0];
	this.texture = c.texture;
	this.uv = c.uv ?? [0, 0];
	if (c.type === "text") {
		this.texture = "font/ascii.png";
		this.text = c.text ?? "";
		this.color = c.color ?? Color.white;
		this.text_shadow = c.text_shadow ?? false;
		this.text_background = c.text_background ?? false;
		this.text_background_alpha = c.text_background_alpha ?? 1;
	}
}