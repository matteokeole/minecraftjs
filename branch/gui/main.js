import {Layer} from "./Layer.js";
import {Component} from "./Component.js";
import {Text} from "./Text.js";
import {Button} from "./Button.js";
import {Tooltip, tooltip_elements} from "./Tooltip.js";

export const
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
	SOURCES = ["font/ascii.png"],
	TEXTURES = {},
	RESOURCES = [
		"../../assets/font.json",
	],
	LAYERS = [],
	LayerFragment = document.createDocumentFragment(),
	Visibilities = ["hidden", "visible"],
	sort_components = () => {
		for (let l of LAYERS) {
			for (let c of Object.values(l.components)) {
				c.texture && SOURCES.push(c.texture);
				c.tooltip_text && tooltip_elements.push(c);
			}
		}
	},
	load_textures = callback => {
		// Get rid of duplicate sources
		let sources = [...new Set(SOURCES)],
			sources_length = sources.length,
			i = 0;

		// Load once each texture into an image
		for (let s of sources) {
			if (!(s in TEXTURES)) {
				TEXTURES[s] = new Image();
				TEXTURES[s].addEventListener("load", () => {
					// Run the callback function when all textures are loaded
					++i === sources_length && callback();
				});
				TEXTURES[s].src = `../../assets/textures/${s}`;
			}
		}
	},
	/**
	 * Resize the layers according to the window size and update the CSS --scale variable with the new scale.
	 */
	update_scale = () => {
		// Store the new window dimensions
		WINDOW.W = Math.ceil(innerWidth / 2) * 2;
		WINDOW.H = Math.ceil(innerHeight / 2) * 2;

		// Reset the scale to default
		scale = default_scale;

		// Calculate the new scale
		/*for (let i = default_scale + 1; i > 1; i--) {
			(WINDOW.W <= WINDOW.DW * i || WINDOW.H < WINDOW.DH * i) && (scale = i - 1);
		}*/

		if (scale !== old_scale) {
			// Update the old scale if it differs from the current one
			old_scale = scale;

			// Update CSS --scale
			document.documentElement.style.setProperty("--scale", `${scale}px`);
		}

		// Redraw layers
		for (let l of LAYERS) {l.resize()}
	},
	button_hovering = l => {
		let button = Button.locate(l, WINDOW.X, WINDOW.Y);

		for (let b of l.buttons) {
			if (b.hovered) {
				// Leave the button
				b.hovered = false;

				l.erase(b).draw(b); // Avoid component recomputing
			}
		}

		if (button) {
			if (!button.disabled && !button.hovered) {
				// Hover the button
				button.hovered = true;

				l.erase(button).draw(button); // Avoid component recomputing
			}
		}
	},
	button_action = l => {
		for (let b of l.buttons) {b.hovered && b.action()}
	};

export let
	debug_enabled = true,
	Font = {},					// Font data
	Color,						// Color list
	default_scale = 4,			// Default GUI scale
	scale = default_scale,		// Current GUI scale
	old_scale;					// Previous GUI scale

(() => {
	// Check for Fetch API browser compatibility
	if (!"fetch" in window) return console.error("This browser doesn't support Fetch API.");

	// Fetch resources
	Promise
		.all(RESOURCES.map(r => fetch(r).then(response => response.json())))
		.then(response => {
			// Stock response
			Font.chars = response[0].chars;
			Font.size = response[0].size;
			Color = response[0].color;

			// Main menu layer
			LAYERS.push(new Layer({
				name: "pause",
				components: {
					/*minecraft1: new Component({
						origin: ["center", "top"],
						offset: [-59, 30],
						size: [156, 44],
						texture: "gui/title/minecraft.png",
						uv: [0, 0],
					}),
					minecraft2: new Component({
						origin: ["center", "top"],
						offset: [78, 30],
						size: [120, 44],
						texture: "gui/title/minecraft.png",
						uv: [0, 45],
					}),*/
					singleplayer: new Button({
						origin: ["center", "center"],
						offset: [0, -77],
						size: [200, 20],
						text: "Singleplayer",
					}),
					multiplayer: new Button({
						origin: ["center", "center"],
						offset: [0, -53],
						size: [200, 20],
						text: "Multiplayer",
						disabled: true,
						tooltip_text: "Not implemented yet!",
					}),
					repository: new Button({
						origin: ["center", "center"],
						offset: [0, -29],
						size: [200, 20],
						text: "Open GitHub Repository...",
						disabled: false,
						action: () => open("https://github.com/matteoo34/minecraftjs"),
					}),
					options: new Button({
						origin: ["center", "center"],
						offset: [-51, 7],
						size: [98, 20],
						text: "Options...",
					}),
					quit: new Button({
						origin: ["center", "center"],
						offset: [51, 7],
						size: [98, 20],
						text: "Quit Game",
						disabled: true,
					}),
					version: new Text({
						origin: ["center", "bottom"],
						offset: [0, 2],
						text: "test",
						text_shadow: true,
					}),
				},
			}));

			document.body.appendChild(LayerFragment);

			sort_components();

			load_textures(() => {
				update_scale();
				Tooltip.init();

				// Window resizing event
				addEventListener("resize", update_scale);

				// Right click event
				addEventListener("contextmenu", e => e.preventDefault());

				// Moving mouse event
				addEventListener("mousemove", e => {
					WINDOW.X = Math.ceil(e.clientX / scale) * scale;
					WINDOW.Y = Math.ceil(e.clientY / scale) * scale;

					button_hovering(LAYERS[0]);
				});

				// Left click event
				addEventListener("mousedown", e => {
					WINDOW.X = Math.ceil(e.clientX / scale) * scale;
					WINDOW.Y = Math.ceil(e.clientY / scale) * scale;

					e.which === 1 && button_action(LAYERS[0]);
				});
			});
		})
		.catch(error => console.error(error));
})();