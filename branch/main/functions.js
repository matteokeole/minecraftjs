import {Fetch} from "./main.js";

/**
 * Create a new game item.
 *
 * Param	Type		Name		Description			Default value
 * @param	{object}	item		Item data object	{}
 * @param	{string}	item.id		Item ID				1 (air)
 */
export function Item(item = {}) {
	// ID (from item ID list)
	this.id = item.id ?? 1;

	// Get the item from the item list (filter by ID)
	let tempItem = Fetch.items.filter(i => this.id === i.id)[0];

	// Simplified name
	this.name = tempItem.name ?? "";

	// Display name
	this.displayName = tempItem.displayName ?? "";

	// Current slot
	this.slot = null;

	// Stack number
	this.stackCount = 1;

	// Max stack number
	this.stackSize = tempItem.stackSize ?? 64;

	this.setStack = (count = this.stackCount) => {
		if (count > this.stackSize) count = this.stackSize;
		this.stackCount = count;
	};

	// Delete temp item
	tempItem = null;

	console.info("Item created", this);

	return this;
}