import {Layer} from "./layer.js";
import {Component} from "./component.js";

export const
	WINDOW = {
		DEFAULT_WIDTH: 320,
		DEFAULT_HEIGHT: 240,
		WIDTH: window.innerWidth,
		HEIGHT: window.innerHeight,
		MAX_WIDTH: window.screen.width,
		MAX_HEIGHT: window.screen.height,
	},
	LOADED_TEXTURES = {},
	layer_set = document.createDocumentFragment(),
	update_scale = update => {
		WINDOW.WIDTH = window.innerWidth;
		WINDOW.HEIGHT = window.innerHeight;
		scale = gui_scale;
		for (let i = gui_scale + 1; i > 1; i--) {
			if (
				WINDOW.WIDTH <= i * WINDOW.DEFAULT_WIDTH ||
				WINDOW.HEIGHT < i * WINDOW.DEFAULT_HEIGHT
			) scale = i - 1;
		}
		LAYERS.hud.resize();
		update ? LAYERS.hud.update() : LAYERS.hud.redraw();
	},
	resources = ["assets/font.json",],
	LAYERS = {};

export let
	Font = {},
	Color,
	gui_scale = 2,
	scale = gui_scale,
	rescale;

(() => {
	// Check for Fetch API browser compatibility
	if (!"fetch" in window) return console.error("This browser doesn't support Fetch API.");

	Promise
		.all(resources.map(r => fetch(r).then(response => response.json())))
		.then(response => {
			Font.chars = response[0].chars;
			Font.size = response[0].size;
			Color = response[0].color;

			LAYERS.hud = new Layer({
				name: "hud",
				components: {
					hotbar: new Component({
						origin: ["center", "bottom"],
						offset: [0, 0],
						size: [182, 22],
						texture: "gui/widgets.png",
						uv: [0, 0],
					}),
					selector: new Component({
						origin: ["center", "bottom"],
						offset: [-80, -1],
						size: [24, 24],
						texture: "gui/widgets.png",
						uv: [0, 22],
					}),
					tooltip: new Component({
						type: "text",
						origin: ["center", "bottom"],
						offset: [0, 40],
						text: "Tooltip",
						color: Color.white,
						text_shadow: true,
					}),
				},
			});

			document.body.appendChild(layer_set);

			update_scale(true);
			addEventListener("resize", () => {
				clearTimeout(rescale);
				rescale = setTimeout(update_scale, 50);
			});
		})
		.catch(error => console.error(error));
})();