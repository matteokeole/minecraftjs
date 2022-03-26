import {Layer} from "./Layer.js";
import {Component} from "./Component.js";

export const
	WINDOW = {
		DEFAULT_WIDTH:	320,
		DEFAULT_HEIGHT:	240,
		WIDTH:			innerWidth,
		HEIGHT:			innerHeight,
		MAX_WIDTH:		screen.width,
		MAX_HEIGHT:		screen.height,
	},
	TEXTURES = {},
	UI = {},
	RESOURCES = [
		"../../../assets/font.json",
	],
	load_textures = callback => {
		let sources = [],
			j = 0;

		for (let l of layer_values) {
			Object.values(l.components).map(c => c.texture && sources.push(c.texture));
		}

		sources = [...new Set(sources)];

		for (let i of sources) {
			if (!(i in TEXTURES)) {
				TEXTURES[i] = new Image();
				TEXTURES[i].addEventListener("load", () => {
					// Run the callback function when all textures are loaded
					if (++j === sources.length) {
						layer_values.forEach(l => update_scale(l));
						callback();
					}
				});
				TEXTURES[i].src = `../../../assets/textures/${i}`;
			}
		}
	},
	calc_scale = () => {
		WINDOW.WIDTH = Math.ceil(innerWidth / 2) * 2;
		WINDOW.HEIGHT = Math.ceil(innerHeight / 2) * 2;
		scale = gui_scale;
		for (let i = gui_scale + 1; i > 1; i--) {
			if (
				WINDOW.WIDTH <= i * WINDOW.DEFAULT_WIDTH ||
				WINDOW.HEIGHT < i * WINDOW.DEFAULT_HEIGHT
			) scale = i - 1;
		}
	},
	update_scale = l => {
		// Update CSS scale variable
		document.documentElement.style.setProperty("--scale", `${scale}px`);

		if (l.components.display) l.components.display.text = `Display: ${WINDOW.WIDTH}x${WINDOW.HEIGHT}`;
		l.resize().redraw();
	},
	enable_button_hovering = (l, e) => {
		// Get the button list
		let buttons = Object.values(l.components).filter(c => c.type === "button"),
			x = e.clientX,
			y = e.clientY;

		for (let b of buttons) {
			if (
				x >= b.x		&&	// Left side
				x < b.x + b.w	&&	// Right side
				y >= b.y		&&	// Top side
				y <= b.y + b.h		// Bottom side
			) {
				// Hover the button
				b.hovered = true;
				l.redraw(b);
			} else {
				if (b.hovered) {
					// Restore the button
					b.hovered = false;
					l.redraw(b);
				}
			}
		}
	},
	enable_button_action = (l, e) => {
		// Get the button list
		let buttons = Object.values(l.components).filter(c => c.type === "button"),
			x = e.clientX,
			y = e.clientY;

		for (let b of buttons) {
			if (b.hovered) window.open(b.link);
		}
	},
	LayerFragment = document.createDocumentFragment(),
	Font = {},
	Visibilities = ["hidden", "visible"];

export let
	Color, // Fetched color list
	layer_values, // Array of layers
	gui_scale = 2, // Preferred interface scale
	scale = gui_scale; // Current interface scale

(() => {
	// Check for Fetch API browser compatibility
	if (!"fetch" in window) return console.error("This browser doesn't support Fetch API.");

	// Fetch JSON resources
	Promise
		.all(RESOURCES.map(r => fetch(r).then(response => response.json())))
		.then(response => {
			// Stock response
			Font.chars = response[0].chars;
			Font.size = response[0].size;
			Color = response[0].color;
			calc_scale();

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
						text: "GitHub Repository...",
						color: Color.black,
						text_shadow: true,
						link: "https://github.com/matteoo34/minecraftjs",
					}),
				},
			});

			// Get UI content as an array
			layer_values = Object.values(UI);

			load_textures(() => {
				// Textures loaded
				document.body.appendChild(LayerFragment);

				// Window resize event
				addEventListener("resize", () => {
					// Update layers with the new scale
					calc_scale();
					layer_values.forEach(l => update_scale(l));
				});

				// Right click event
				addEventListener("contextmenu", e => e.preventDefault());

				// Mouse move event
				UI.pause.canvas.addEventListener("mousemove", e => enable_button_hovering(UI.pause, e));

				// Left click event
				UI.pause.canvas.addEventListener("mousedown", e => {
					e.which === 1 && enable_button_action(UI.pause, e);
				});
			});
		})
		.catch(error => console.error(error));
})();

// #3f3f3f