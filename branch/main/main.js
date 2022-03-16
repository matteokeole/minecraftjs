import {Layer} from "./layer.js";

export const Fetch = {
	items: undefined,
};

(() => {
	// Check for Fetch API browser compatibility
	if (!("fetch" in window)) {
		console.error("This browser doesn't support Fetch API.");
		return;
	}

	Promise
		.all([
			fetch("../../assets/items.json").then(response => response.json()),
		])
		.then(response => {
			Fetch.items = response[0];

			const HUD = new Layer({name: "hud"});
		})
		.catch(error => console.error(error));
})();