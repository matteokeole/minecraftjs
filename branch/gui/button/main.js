import {Layer} from "./Layer.js";
import {Component} from "./Component.js";
import {Button} from "./Button.js";

export const
	WINDOW = {
		DW: 320,
		DH: 240,
		W: innerWidth,
		H: innerHeight,
		MW: screen.width,
		MH: screen.height,
	},
	SOURCES = ["font/ascii.png"],
	TEXTURES = {},
	RESOURCES = [
		"../../../assets/font.json",
	],
	LAYERS = [],
	LayerFragment = document.createDocumentFragment(),
	Visibilities = ["hidden", "visible"],
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
				TEXTURES[s].src = `../../../assets/textures/${s}`;
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
		for (let i = default_scale + 1; i > 1; i--) {
			(WINDOW.W <= WINDOW.DW * i || WINDOW.H < WINDOW.DH * i) && (scale = i - 1);
		}

		if (scale !== old_scale) {
			// Update the old scale if it differs from the current one
			old_scale = scale;

			// Update CSS --scale
			document.documentElement.style.setProperty("--scale", `${scale}px`);
		}

		// Redraw layers
		for (let l of LAYERS) {l.resize()}
	},
	button_hovering = (l, e) => {
		let x = e.clientX, y = e.clientY;

		for (let b of l.buttons) {
			if (
				x >= b.x		&&	// Left side
				x < b.x + b.w	&&	// Right side
				y >= b.y		&&	// Top side
				y <= b.y + b.h	&&	// Bottom side
				!b.disabled			// Disabled buttons can't be hovered
			) {
				// Hover the button
				if (!b.hovered) {
					b.hovered = true;
					l.erase(b).draw(b); // Avoid re-computing the component
				}
			} else {
				// Leave the button
				if (b.hovered) {
					b.hovered = false;
					l.erase(b).draw(b); // Avoid re-computing the component
				}
			}
		}
	},
	button_action = l => {
		for (let b of l.buttons) {
			b.hovered && b.action();
		}
	};

export let
	Font = {},					// Font data
	Color,						// Color list
	default_scale = 2,			// Default GUI scale
	scale = default_scale,		// Current GUI scale
	old_scale = default_scale;	// Previous GUI scale

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

			// Pause menu layer
			LAYERS.push(new Layer({
				name: "pause",
				components: {
					button1: new Button({
						origin: ["center", "center"],
						offset: [0, 0],
						size: [200, 20],
						text: "Enabled Button",
					}),
					button2: new Button({
						origin: ["center", "center"],
						offset: [0, 24],
						size: [200, 20],
						text: "Disabled Button",
						disabled: true,
					}),
					button3: new Button({
						origin: ["center", "bottom"],
						offset: [0, 9],
						size: [200, 20],
						text: "View GitHub Repository...",
						disabled: false,
						action: () => open("https://github.com/matteoo34/minecraftjs"),
					}),
				},
			}));

			document.body.appendChild(LayerFragment);

			load_textures(() => {
				update_scale();

				// Window resizing event
				addEventListener("resize", update_scale);

				// Right click event
				addEventListener("contextmenu", e => e.preventDefault());

				// Moving mouse event
				LAYERS[0].canvas.addEventListener("mousemove", e => button_hovering(LAYERS[0], e));

				// Left click event
				LAYERS[0].canvas.addEventListener("mousedown", e => {
					e.which === 1 && button_action(LAYERS[0]);
				});
			});
		})
		.catch(error => console.error(error));
})();