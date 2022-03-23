import {LOADED_TEXTURES} from "./main.js";
export function Slot(s = {}) {
	this.id = i++;
	this.type = s.type;
	this.offset = s.offset;
	this.size = [18, 18];
	this.component = null;
	this.transparent = s.transparent;
	this.reference_for = [];
	if (s.refer_to) {
		s.refer_to.reference_for.push(this);
		this.refer_to = s.refer_to;
	} else {
		this.item = null;
		this.assign = i => {
			if (!(i.texture in LOADED_TEXTURES)) {
				LOADED_TEXTURES[i.texture] = new Image();
				LOADED_TEXTURES[i.texture].src = `assets/textures/${i.texture}`;
			}
			i.slot = this;
			if (this.reference_for) {
				for (let s of this.reference_for) {
					s.component.draw_slot(s);
				}
			}
			this.item = i;
			return this;
		};
		this.empty = () => {
			this.item = null;
			if (this.reference_for) {
				for (let s of this.reference_for) {
					s.component.draw_slot(s);
				}
			}
			return this;
		};
	}
}

Slot.get_slot_at = (c, e) => {
	let x = e.clientX,
		y = e.clientY;
	for (let s of c.slots) {
		if (
			x >= s.x && // From left side
			x < s.x + s.w && // From right side
			y > s.y && // From top side
			y < s.y + s.h // From bottom side
		) return s;
	}

	return false;
};

let i = 0;