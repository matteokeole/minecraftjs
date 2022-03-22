import {scale, Color} from "./main.js";
export function Component(c = {}) {
	this.type = c.type ?? "default";
	this.origin = c.origin;
	this.offset = c.offset;
	this.size = c.size ?? [];
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
		this.slots = c.slots;
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
		this.draw_slot = (s, c = "#8D8D8D") => {
			this.layer.ctx.fillStyle = c;
			this.layer.ctx.fillRect(
				s.x + scale, s.y + scale,
				s.w - 2 * scale, s.h - 2 * scale,
			);
			return this;
		};
	}
}
