import {LOADED_TEXTURES, scale} from "./main.js";

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

	// Attributes that depend on the slot reference
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
		// This slot is not refering to another slot; it can be a single slot or a reference slot
		// Allow the slot to get an item
		this.item = null;

		/**
		 * Assign an item to the slot and return the previous one if it exists.
		 * This also loads the item texture once.
		 * @param	{object}	i	The item to be assigned
		 */
		this.assign = i => {
			// Stock the previous item during the swap
			const prev_item = this.item;

			// Check if the item texture is already loaded, and load it in this case
			if (!(i.texture in LOADED_TEXTURES)) {
				LOADED_TEXTURES[i.texture] = new Image();
				LOADED_TEXTURES[i.texture].addEventListener("load", () => {
					// Append the item to the slot
					i.slot = this;
					this.item = i;

					// Render updated slot
					this.reference_for && this.reference_for.forEach(s => s.render_item());
				});
				LOADED_TEXTURES[i.texture].src = `assets/textures/${i.texture}`;
			} else {
				// The texture is already loaded, append the item to the slot
				i.slot = this;
				this.item = i;

				// Render updated slot
				this.reference_for ? this.reference_for.forEach(s => s.render_item()) : this.render_item();
			}

			return prev_item;
		};

		/**
		 * Remove the slot current item and return it.
		 */
		this.empty = () => {
			let removed_item = this.item;

			this.item = null;

			if (this.reference_for) this.reference_for.forEach(s => {
				Slot.clear_background(s);
				if (s.hovered) s.hover();
			});
			else Slot.clear_background(this);

			// Hover the slot if it was hovered before the process
			if (this.hovered) this.hover();

			return removed_item;
		};
	}

	this.render_item = () => {
		Slot.clear_background(this);
		if (this.refer_to) {
			if (this.refer_to.item) {
				this.component.layer.ctx.drawImage(
					LOADED_TEXTURES[this.refer_to.item.texture],
					0, 0,
					16, 16,
					this.x + scale, this.y + scale,
					this.w - 2 * scale, this.h - 2 * scale,
				);
			}
		} else if (this.item) {
			this.component.layer.ctx.drawImage(
				LOADED_TEXTURES[this.item.texture],
				0, 0,
				16, 16,
				this.x + scale, this.y + scale,
				this.w - 2 * scale, this.h - 2 * scale,
			);
		}

		if (this.hovered) this.hover();
	};

	/**
	 * Apply an hover effect to the slot.
	 */
	this.hover = () => {
		this.hovered = true;

		// Lighten the slot
		this.component.layer.ctx.fillStyle = "#ffffff";
		this.component.layer.ctx.globalAlpha = .5; // #c5c5c5
		this.component.layer.ctx.fillRect(
			this.x + scale,
			this.y + scale,
			this.w - 2 * scale,
			this.h - 2 * scale,
		);

		// Reset the alpha value for future drawings
		this.component.layer.ctx.globalAlpha = 1;

		return this;
	};

	/**
	 * Remove the slot hover effect.
	 */
	this.leave = () => {
		// Draw slot background color
		this.component.layer.ctx.fillStyle = "#8d8d8d";
		this.component.layer.ctx.fillRect(
			this.x + scale,
			this.y + scale,
			this.w - 2 * scale,
			this.h - 2 * scale,
		);

		// Draw slot item if there is one
		let item = this.item || this.refer_to && this.refer_to.item;
		if (item) {
			this.component.layer.ctx.drawImage(
				LOADED_TEXTURES[item.texture],
				0,
				0,
				16,
				16,
				this.x + scale,
				this.y + scale,
				this.w - 2 * scale,
				this.h - 2 * scale,
			);
		}

		return this;
	};
}

Slot.clear_background = s => {
	s.component.layer.ctx.clearRect(
		s.x + scale, s.y + scale,
		s.w - 2 * scale, s.h - 2 * scale,
	);
	s.component.layer.ctx.drawImage(
		LOADED_TEXTURES[s.component.texture],
		s.offset[0] + 1, s.offset[1] + 1,
		16, 16,
		s.x + scale, s.y + scale,
		s.w - 2 * scale, s.h - 2 * scale,
	);
};

/**
 * Return the slot found at the event coordinates, or false if none is found.
 * @param	{object}	c							Parent component
 * @param	{object}	e							Event object
 * @param	{object}	[include_references=true]	Indicates whereas to include reference slots in the return
 */
Slot.get_slot_at = (c, e, include_references = true) => {
	let x = e.clientX,
		y = e.clientY;

	for (let s of c.slots) {
		if (
			x >= s.x		&&	// Left side
			x < s.x + s.w	&&	// Right side
			y >= s.y		&&	// Top side
			y <= s.y + s.h		// Bottom side
		) {
			if (include_references && s.refer_to) return s.refer_to;
			else return s;
		}
	}

	return false;
};