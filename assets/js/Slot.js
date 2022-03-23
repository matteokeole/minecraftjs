import {LOADED_TEXTURES} from "./main.js";
export function Slot(s = {}) {
	this.id = i++;
	this.type = s.type;
	this.origin = s.origin;
	this.offset = s.offset;
	this.size = [18, 18];
	this.component = null;
	this.item = null;
	this.assign = i => {
		if (!(i.texture in LOADED_TEXTURES)) {
			LOADED_TEXTURES[i.texture] = new Image();
			LOADED_TEXTURES[i.texture].src = `assets/textures/${i.texture}`;
		}
		i.slot = this;
		this.item = i;
		return this;
	};
	this.empty = () => {
		this.item = null;
		return this;
	};
}

Slot.get_slot_at = (c, e) => {
	for (let s of c.slots) {
		if (
			e.clientX >= s.x && // From left side
			e.clientX < s.x + s.w && // From right side
			e.clientY > s.y && // From top side
			e.clientY < s.y + s.h // From bottom side
		) return s;
	}

	return false;
};

let i = 0;