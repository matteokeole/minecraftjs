/**
 * Create a new game item.
 *
 * Param	Type		Name		Description			Default value
 * @param	{object}	item		Item data object	{}
 * @param	{string}	item.id		Item ID				1
 * @param	{string}	item.stack	Item stack count	1
 */
export function Item(item = {}) {
	// ID (from item ID list)
	this.id = item.id ?? 1;

	// Simplified name
	this.name = item.name ?? "";

	// Display name
	this.displayName = item.displayName ?? "";

	// Current slot
	this.slot = null;

	// Stack size
	this.stackSize = item.stackSize ?? 1;

	this.setStack = (count = 1) => {
		this.stackSize = count;
	};

	return this;
}