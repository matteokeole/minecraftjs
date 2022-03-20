import {Fetch} from "./../main.js";

/**
 * Create a new game item.
 *
 * Param	Type		Name=Default	Description
 * @param	{number}	[id=1]			Item ID
 */
export const Item = function(id = 1) {
	// ID
	this.id = id;

	// Get the item from the fetched list
	let temp = Fetch.items.filter(i => this.id === i.id)[0];

	// Code name
	this.name = temp.name ?? "";

	// Display name
	this.display_name = temp.displayName ?? "";

	// Parent slot
	this.slot = null;

	temp = null;

	return this;
};