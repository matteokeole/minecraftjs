import {Layer} from "./Layer.js";
import {Component} from "./Component.js";

export const
	WINDOW = {
		DW: 320,
		DH: 240,
		W: innerWidth,
		H: innerHeight,
		MW: screen.width,
		MH: screen.height,
	},
	TEXTURES = {},
	UI = {},
	RESOURCES = [
		"../../../assets/font.json",
	],
	LAYERS = [],
	LayerFragment = document.createDocumentFragment(),
	Visibilities = ["hidden", "visible"],
	load_textures = callback => {
		// Get the texture sources list
		let sources = [];
		for (let l of LAYERS) {
			Object.values(l.components).map(c => sources.push(c.texture));
		}

		// Get rid of duplicate sources
		sources = [...new Set(sources)];

		let sources_length = sources.length,
			j = 0;

		// If the texture isn't in the list, load it into an image
		for (let i of sources) {
			if (!(i in TEXTURES)) {
				TEXTURES[i] = new Image();
				TEXTURES[i].addEventListener("load", () => {
					// Run the callback function when all textures are loaded
					++j === sources_length && callback();
				});
				TEXTURES[i].src = `../../../assets/textures/${i}`;
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
				y <= b.y + b.h		// Bottom side
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
	button_action = (l, e) => {
		for (let b of l.buttons) {
			if (b.hovered) open(b.link);
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
			UI.pause = new Layer({
				name: "pause",
				components: {
					loader: new Component({
						type: "button",
						texture: "font/ascii.png",
					}),
					github_link: new Component({
						type: "button",
						origin: ["center", "center"],
						offset: [0, 0],
						size: [200, 20],
						texture: "gui/widgets.png",
						uv: [0, 66],
						uv2: [0, 86],
						text: "View GitHub Repository...",
						color: Color.black,
						text_shadow: true,
						link: "https://github.com/matteoo34/minecraftjs",
					}),
				},
			});

			document.body.appendChild(LayerFragment);

			load_textures(() => {
				update_scale();

				// Window resizing event
				addEventListener("resize", update_scale);

				// Right click event
				addEventListener("contextmenu", e => e.preventDefault());

				// Moving mouse event
				UI.pause.canvas.addEventListener("mousemove", e => button_hovering(UI.pause, e));

				// Left click event
				UI.pause.canvas.addEventListener("mousedown", e => {
					e.which === 1 && button_action(UI.pause, e);
				});
			});
		})
		.catch(error => console.error(error));
})();