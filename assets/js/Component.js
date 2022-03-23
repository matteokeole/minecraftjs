import {Slot} from "./Slot.js";
import {Item} from "./Item.js";
import {LOADED_TEXTURES, scale, Color} from "./main.js";
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
		this.slots = c.slots ?? [];
		for (let s of this.slots) {s.component = this}
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
		this.draw_slot = (s, hover = false) => {
			this.layer.ctx.globalAlpha = 1;
			if (s.refer_to && s.refer_to.item) this.draw_reference_slot(s);
			if (hover && !s.transparent) {
				this.layer.ctx.fillStyle = "#fff";
				this.layer.ctx.globalAlpha = .496;
				this.layer.ctx.fillRect(
					s.x + scale, s.y + scale,
					s.w - 2 * scale, s.h - 2 * scale,
				);
			} else {
				if (!s.transparent) {
					this.layer.ctx.fillStyle = "#8d8d8d";
					this.layer.ctx.fillRect(
						s.x + scale, s.y + scale,
						s.w - 2 * scale, s.h - 2 * scale,
					);
				}
				if (s.item && LOADED_TEXTURES[s.item.texture]) {
					this.layer.ctx.drawImage(
						LOADED_TEXTURES[s.item.texture],
						0, 0,
						16, 16,
						s.x + scale, s.y + scale,
						s.w - 2 * scale, s.h - 2 * scale,
					);
				} else if (s.refer_to && s.refer_to.item) this.draw_reference_slot(s);
			}
			return this;
		};
		this.draw_reference_slot = s => {
			this.layer.ctx.drawImage(
				LOADED_TEXTURES[s.refer_to.item.texture],
				0, 0,
				16, 16,
				s.x + scale, s.y + scale,
				s.w - 2 * scale, s.h - 2 * scale,
			);
		};
	}
}