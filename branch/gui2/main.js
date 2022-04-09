import {Layer, LayerFragment} from "./class/Layer.js";

export const
	// Debug options
	debugging = {
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
	// Texture path list
	SOURCES = ["font/ascii.png"],
	// Texture list (loaded images)
	TEXTURES = {};

export let
	// Layer list
	LAYERS;

(() => {
	// Check for Fetch API browser compatibility
	if (!"fetch" in window) return console.error("This browser doesn't support Fetch API.");

	// Fetch JSON resources
	Promise
		.all(RESOURCES.map(r => fetch(r).then(response => response.json())))
		.then(response => {
			// Create layers
			LAYERS = response[0].map(l => new Layer(l));
			console.info(LAYERS);
			document.body.appendChild(LayerFragment);
		})
		.catch(error => console.error(error));
})();