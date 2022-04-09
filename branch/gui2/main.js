import {Layer, LayerFragment} from "./class/Layer.js";
import {load_textures} from "./functions/load_textures.js";
import {scale, rescale} from "./functions/rescale.js";

export const
	// Debugging options
	__debug = {
		force_max_scale: true,
		debug_menu_enabled: true,
	},
	// Resource list (mostly JSON)
	RESOURCES = [
		// "../../assets/font.json",
		"gui.json",
	],
	// Screen properties (sizes and current cursor position)
	WINDOW = {
		DW: 320,
		DH: 240,
		W: innerWidth,
		H: innerHeight,
		MW: screen.width,
		MH: screen.height,
		X: 0,
		Y: 0,
	},
	// Texture path list (set the preloaded textures here)
	SOURCES = ["font/ascii.png"];

// Layer list
export let LAYERS;

(() => {
	// Check for Fetch API browser compatibility
	if (!"fetch" in window) return console.error("This browser doesn't support Fetch API.");

	// Fetch JSON resources
	Promise
		.all(RESOURCES.map(r => fetch(r).then(response => response.json())))
		.then(response => {
			// Create layers
			LAYERS = response[0].map(l => new Layer(l));

			document.body.appendChild(LayerFragment);

			load_textures(rescale);

			addEventListener("resize", rescale);
		})
		.catch(error => console.error(error));
})();