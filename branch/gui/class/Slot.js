let i = -1;

/**
 * Construct a slot (item container).
 *
 * Param	Type		Name=Default				Description
 * @param	{object}	[slot={}]					Slot data object
 * @param	{string}	[slot.type="default"]		Slot type
 * @param	{array}		[slot.origin=["left, "top]]	Slot origin
 * @param	{array}		[slot.offset=[0, 0]]		Slot offset
 */
export const Slot = function(slot = {}) {
	// ID
	this.id = ++i;

	// Type
	this.type = slot.type ?? "default";

	// Parent component
	this.component = null;

	// Origin
	this.origin = slot.origin ?? [0, 0];

	// Offset
	this.offset = slot.offset ?? [0, 0];

	// Size
	this.size = [18, 18];

	// Current assigned item
	this.item = null;

	/**
	 * Assign an item to the slot and return the previous one.
	 * @param	{object}	item	The item to be assigned
	 */
	this.assign = item => {
		// Stock the previous item during the swap
		const prev_item = this.item;

		this.item = item;

		return prev_item;
	};

	/**
	 * Remove the slot current item.
	 */
	this.empty = () => {
		this.item = null;
	};

	return this;
};

/**
 * Return the slot found at the specified coordinates or false if none is found.
 * @param	{object}	component	The parent component
 * @param	{number}	[x=0]		The X coordinate to check
 * @param	{number}	[y=0]		The Y coordinate to check
 */
Slot.get_slot_at = (component, x = 0, y = 0) => {
	for (let slot of component.slots) {
		if (
			x >= slot.x && // From left side
			x < slot.x + slot.size.x * component.layer.scale && // From right side
			y > slot.y && // From top side
			y < slot.y + slot.size.y * component.layer.scale // From bottom side
		) return slot;
	}

	return false;
};