import {scale} from "../functions/update_scale.js";
import {TEXTURES} from "../main.js";

let i = 0;

/**
 * Construct a new slot (item parent container).
 *
 * Param	Type		Name=Default	Description
 * @param	{object}	[slot={}]		Slot data object
 * @param	{string}	slot.type		Type
 * @param	{array}		slot.offset		Offset
 * @param	{object}	[slot.refer_to]	Reference to the parent slot
 */
export const Slot = function(slot = {}) {
	// ID
	this.id = i++;

	// Type
	this.type = slot.type;

	// Parent component
	this.component = null;

	// Offset
	this.offset = slot.offset;

	// Size
	this.size = [18, 18];

	// Hover attribute
	this.hovered = false;

	if (slot.refer_to) {
		// This slot is refering to another slot
		let reference = slot.refer_to;

		// Create an array of refering slots for the reference slot if it hasn't been initialized yet
		if (!reference.reference_for) reference.reference_for = [];

		// Link the reference slot with this slot
		reference.reference_for.push(this);

		// Make a backlink on the refering slot
		this.refer_to = reference;
	} else {
		// This slot is not refering to another slot; it can be either a single slot or a reference slot
		this.item = null;

		/**
		 * Assign an item to the slot and return the previous one if it exists.
		 * NOTE: This method loads the item texture if it has not been loaded already.
		 * @param	{object}	i	The item to be assigned
		 */
		this.assign = i => {
			// Stock the previous item during the swap
			let prev_item = this.item;

			// Check if the item texture is already loaded, and load it in this case
			if (!(i.texture in TEXTURES)) {
				TEXTURES[i.texture] = new Image();
				TEXTURES[i.texture].addEventListener("load", () => {
					// Append the item to the slot
					i.slot = this;
					this.item = i;

					// Render updated slot
					for (let s of this.reference_for) {s.render_item()}
				});
				TEXTURES[i.texture].src = `assets/textures/${i.texture}`;
			} else {
				// The texture is already loaded, append the item to the slot
				i.slot = this;
				this.item = i;

				// Render updated slot
				let ss = this.reference_for || this;
				for (let s of ss) {s.render_item()}
			}

			return prev_item;
		};

		/**
		 * Remove the slot item.
		 */
		this.empty = () => {
			this.item = null;

			let ss = this.reference_for || this;
			for (let s of ss) {
				Slot.clear_background(s);

				// Hover the slot if it was hovered before the process
				if (s.hovered) s.hover();
			}

			return this;
		};
	}

	this.render_item = () => {
		Slot.clear_background(this);
		Slot.try_draw_item(this);

		this.hovered && this.hover();
	};

	/**
	 * Apply an hover effect to the slot.
	 */
	this.hover = () => {
		this.hovered = true;

		// Lighten the slot
		this.component.layer.ctx.fillStyle = "#ffffff80";
		this.component.layer.ctx.fillRect(
			this.x + scale,
			this.y + scale,
			this.w - 2 * scale,
			this.h - 2 * scale,
		);

		return this;
	};

	/**
	 * Remove the slot hover effect.
	 */
	this.leave = () => {
		this.hovered = false;

		// Darken the slot
		this.component.layer.ctx.fillStyle = "#8b8b8b";
		this.component.layer.ctx.fillRect(
			this.x + scale,
			this.y + scale,
			this.w - 2 * scale,
			this.h - 2 * scale,
		);

		// Draw the slot item if there is one
		Slot.try_draw_item(this);

		return this;
	};
}

Slot.clear_background = s => {
	s.component.layer.ctx.clearRect(
		s.x + scale,
		s.y + scale,
		s.w - 2 * scale,
		s.h - 2 * scale,
	);

	s.component.layer.ctx.drawImage(
		TEXTURES[s.component.texture],
		s.offset[0] + 1,
		s.offset[1] + 1,
		16,
		16,
		s.x + scale,
		s.y + scale,
		s.w - 2 * scale,
		s.h - 2 * scale,
	);
};

Slot.try_draw_item = s => {
	// Draw slot item if there is one
	let item = s.refer_to ? s.refer_to.item : s.item;
	if (item) {
		s.component.layer.ctx.drawImage(
			TEXTURES[item.texture],
			0,
			0,
			16,
			16,
			s.x + scale,
			s.y + scale,
			s.w - 2 * scale,
			s.h - 2 * scale,
		);
	}
};

/**
 * Return the slot found at the event coordinates, or false if none is found.
 * @param	{object}	c							Parent component
 * @param	{object}	e							Event object
 * @param	{object}	[include_references=true]	Indicate whether to include reference slots in the return
 */
Slot.get_slot_at = (c, e, include_references = true) => {
	let x = e.clientX, y = e.clientY;

	for (let s of c.slots) {
		if (
			x >= s.x		&&	// Left side
			x < s.x + s.w	&&	// Right side
			y >= s.y		&&	// Top side
			y <= s.y + s.h		// Bottom side
		) return include_references && s.refer_to ? s.refer_to : s;
	}

	return false;
};