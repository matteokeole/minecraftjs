import {Items} from "./main.js";
export function Item(id) {
	let i = Items.find(i => i.id === id);
	this.id = id;
	this.display_name = i.displayName;
	this.name = i.name;
	this.slot = null;
	this.texture = `item/${this.name}.png`;
}