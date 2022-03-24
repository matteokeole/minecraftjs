import {LOADED_TEXTURES} from "./main.js";

export function Slot(s = {}) {
	this.id = i++;
	this.type = s.type;
	this.offset = s.offset;
	this.size = [18, 18];
	this.component = null;
	this.transparent = s.transparent ?? false;
	if (s.refer_to) {
		if (!s.refer_to.reference_for) s.refer_to.reference_for = [];
		s.refer_to.reference_for.push(this);
		this.refer_to = s.refer_to;
	} else {
		this.item = null;
		this.assign = i => {
			if (!(i.texture in LOADED_TEXTURES)) {
				LOADED_TEXTURES[i.texture] = new Image();
				LOADED_TEXTURES[i.texture].addEventListener("load", () => {
					i.slot = this;
					this.item = i;
					if (this.reference_for) {
						for (let s of this.reference_for) {
							s.component.draw_slot(s);
						}
					}
				});
				LOADED_TEXTURES[i.texture].src = `assets/textures/${i.texture}`;
			} else {
				i.slot = this;
				this.item = i;
				if (this.reference_for) {
					for (let s of this.reference_for) {
						s.component.draw_slot(s);
					}
				} else this.component.draw_slot(this);
			}
			return this;
		};
		this.empty = () => {
			this.item = null;
			if (this.reference_for) {
				for (let s of this.reference_for) {
					s.component.empty_slot(s);
				}
			} else this.component.empty_slot(this);
			return this;
		};
	}
}

/**
 * Return the slot found at the event coordinates, or false if none is found.
 * @param	{object}	c	Parent component
 * @param	{object}	e	Event object
 */
Slot.get_slot_at = (c, e) => {
	let x = e.clientX,
		y = e.clientY;

	for (let s of c.slots) {
		if (
			x >= s.x		&&	// Left side
			x < s.x + s.w	&&	// Right side
			y > s.y			&&	// Top side
			y < s.y + s.h		// Bottom side
		) return s;
	}

	return false;
};

let i = 0;