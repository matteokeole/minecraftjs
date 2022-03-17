/**
 * Construct a slot (item container).
 *
 * Param	Type		Name		Description			Default value
 * @param	{object}	slot		Slot data object	{}
 * @param	{string}	slot.type	Slot type			"default"
 * @param	{array}		slot.origin	Slot position		{x: 0, y: 0}
 */
export const Slot = function(slot = {}) {
	// Type
	this.type = slot.type ?? "default";

	// Parent component
	this.component = null;

	// Origin
	this.origin = {
		x: slot.origin ? slot.origin[0] : 0,
		y: slot.origin ? slot.origin[1] : 0,
	};

	// Current item
	this.item = null;

	/**
	 * Assign an item to the slot and drop the previous one.
	 * @param {object} item - The item to be assigned
	 */
	this.assign = item => {
		// item.displayName = items.filter(i => item.id === i.id)[0].displayName;
		this.item = item;

		return this.component;
	};

	/**
	 * Assign an item to the slot and return the previous one.
	 * @param {object} item - The item to be assigned
	 */
	this.swap = item => {
		// Stock the previous item
		let previousItem = this.item;

		// Assign the new item
		this.assign(item);

		return previousItem;
	};

	/**
	 * Remove the current item from the slot.
	 */
	this.empty = () => {
		this.item = null;
	};

	this.init = () => {
		// Size
		this.size = {
			x: () => 16 * this.component.layer.scale,
			y: () => 16 * this.component.layer.scale,
		};
	};

	return this;
};

/**
 * Return the slot which has the same coordinates as the specified event target. If no slot is found, return False.
 */
Slot.getSlotAt = (c, x, y) => {
	for (let slot of c.slots) {
		if (
			slot.origin.x() - slot.size.x() / 2 <= (x - window.innerWidth / 2).toFixed(0) &&
			slot.origin.x() + slot.size.x() / 2 > (x - window.innerWidth / 2).toFixed(0) &&
			slot.origin.y() - slot.size.y() / 2 <= -(y - window.innerHeight / 2).toFixed(0) &&
			slot.origin.y() + slot.size.y() / 2 >= -(y - window.innerHeight / 2).toFixed(0)
		) return slot;
	}
	return false;
};