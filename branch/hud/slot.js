/**
 * Construct a slot (item container).
 *
 * Param	Type		Name		Description			Default value
 * @param	{object}	slot		Slot data object	{}
 * @param	{string}	slot.type	Slot type			"default"
 * @param	{array}		slot.origin	Slot position		{x: 0, y: 0}
 */
function Slot(slot = {}) {
	// Type
	this.type = slot.type ?? "default";

	// Parent component
	this.component = null;

	// Origin
	this.origin = {
		x: slot.origin ? slot.origin[0] : 0,
		y: slot.origin ? slot.origin[1] : 0,
	};

	// Size
	this.size = {
		x: 16,
		y: 16,
	};

	// Current item
	this.item = null;

	/**
	 * Assign an item to the slot and drop the previous one.
	 * @param {object} item - The item to be assigned
	 */
	this.assign = item => {
		this.item = item;
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

	return this;
}