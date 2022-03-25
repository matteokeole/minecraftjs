import {LOADED_TEXTURES, scale, Color} from "./main.js";
import {Slot} from "./Slot.js";
import {Item} from "./Item.js";

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
	} else if (this.type === "container") {
		this.slots = c.slots ?? [];
		this.slots.forEach(s => s.component = this);
		this.compute_slot = s => {
			let o = [
				s.offset[0] * scale,
				s.offset[1] * scale,
			];
			s.w = s.size[0] * scale;
			s.h = s.size[1] * scale;
			s.x = this.x + o[0];
			s.y = this.y + o[1];
			return this;
		};
	}
}