/**
 * Create a new game item.
 *
 * Param	Type		Name		Description			Default value
 * @param	{object}	item		Item data object	{}
 * @param	{string}	item.id		Item ID				1
 * @param	{string}	item.stack	Item stack count	1
 */
function Item(item = {}) {
	// ID (from item ID list)
	this.id = item.id ?? 1;

	// Current slot
	this.slot = null;

	// Stack count (< 64)
	this.stack = item.stack > 64 ? 64 : 1;

	this.setStack = (count = 1) => {
		// Can't get more than 64 items in one slot
		this.stack = count > 64 ? 64 : count;
	};

	return this;
}