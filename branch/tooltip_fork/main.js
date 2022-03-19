import {Keybinds, Player} from "./variables.js";
import {Layer} from "./layer.js";
import {Component} from "./component.js";
import {Slot} from "./slot.js";
import {Item} from "./item.js";
import {getAutoScale, draw, erase} from "./functions.js";
import "./listeners.js";

export const
	Fetch = {
		font: undefined,
		items: undefined,
	},
	Interface = {};

(() => {
	// Check for Fetch API browser compatibility
	if (!"fetch" in window) return console.error("This browser doesn't support Fetch API.");

	// Request resource files
	Promise
		.all([
			fetch("../../assets/font.json").then(r => r.json()),
			fetch("../../assets/items.json").then(r => r.json()),
		])
		.then(response => {
			Fetch.font = response[0];
			Fetch.items = response[1];

			Interface.container = new Layer({name: "container"});
			Interface.container
				.add(
					new Component({
						name: "title",
						type: "text",
						origin: ["left", "top"],
						offset: [8, 8],
						texture: "font/ascii.png",
						text: "Responsive Layer Demo (tooltip branch fork)",
						text_color: Fetch.font.colors.gray,
						text_shadow: false,
					})
				)
				.add(
					new Component({
						name: "inventory",
						type: "container",
						origin: ["center", "center"],
						offset: [0, 0],
						size: [176, 166],
						texture: "gui/container/inventory.png",
						uv: [0, 0],
					}),
				)
				.update();
		})
		.catch(error => console.error(error));
})();