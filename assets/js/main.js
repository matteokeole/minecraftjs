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
	update_scale = l => {
		WINDOW.WIDTH = window.innerWidth;
		WINDOW.HEIGHT = window.innerHeight;
		scale = gui_scale;
		for (let i = gui_scale + 1; i > 1; i--) {
			if (
				WINDOW.WIDTH <= i * WINDOW.DEFAULT_WIDTH ||
				WINDOW.HEIGHT < i * WINDOW.DEFAULT_HEIGHT
			) scale = i - 1;
		}
		if (l.components.display) l.components.display.text = `Display: ${WINDOW.WIDTH}x${WINDOW.HEIGHT}`;
		l.resize().redraw();
	},
	get_fps = () => {
		let time = performance.now();
		frame++;

		if (time - startTime > 1000) {
			LAYERS[1].components.fps.text = `${(frame / ((time - startTime) / 1000)).toFixed(0)} fps`;
			LAYERS[1].redraw("fps");

			startTime = time;
			frame = 0;
		}

		requestAnimationFrame(get_fps);
	},
	get_js_version = () => {
		for (let i = 1; i <= 9; i++) {
			// Create a new script
			let script = document.createElement("script");

			script.setAttribute("language", `javascript1.${i}`);
			script.textContent = `js = 1.${i}`;

			document.body.appendChild(script);

			// Remove the script when the version is obtained
			script.remove();
		}

		return js;
	},
	get_platform = () => {
		return (navigator.userAgent.includes("WOW64") || navigator.platform === "Win64") ? 64 : 32;
	},
	resources = ["assets/font.json",],
	LAYERS = [];

export let
	Font = {},
	Color,
	gui_scale = 2,
	scale = gui_scale,
	startTime = performance.now(),
	frame = 0;

(() => {
	// Check for Fetch API browser compatibility
	if (!"fetch" in window) return console.error("This browser doesn't support Fetch API.");

	Promise
		.all(resources.map(r => fetch(r).then(response => response.json())))
		.then(response => {
			Font.chars = response[0].chars;
			Font.size = response[0].size;
			Color = response[0].color;

			LAYERS.push(
				new Layer({
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
				}),
				new Layer({
					name: "debug",
					components: {
						version: new Component({
							type: "text",
							offset: [1, 1],
							text: "Minecraft JS (pre-alpha 220319)",
							text_background: "#080400",
							text_background_alpha: .21,
							text_color: Color.white,
						}),
						fps: new Component({
							type: "text",
							offset: [1, 10],
							text: get_fps(),
							text_background: "#080400",
							text_background_alpha: .21,
							text_color: Color.white,
						}),
						xyz: new Component({
							type: "text",
							offset: [1, 28],
							text: "XYZ: 0.000 / 0.00000 / 0.000",
							text_background: "#080400",
							text_background_alpha: .21,
							text_color: Color.white,
						}),
						block: new Component({
							type: "text",
							offset: [1, 37],
							text: "Block: 0 0 0",
							text_background: "#080400",
							text_background_alpha: .21,
							text_color: Color.white,
						}),
						chunk: new Component({
							type: "text",
							offset: [1, 46],
							text: "Chunk: 0 0 0",
							text_background: "#080400",
							text_background_alpha: .21,
							text_color: Color.white,
						}),
						facing: new Component({
							type: "text",
							offset: [1, 55],
							text: "Facing: - (Towards - -) (0 / 0)",
							text_background: "#080400",
							text_background_alpha: .21,
							text_color: Color.white,
						}),
						js: new Component({
							type: "text",
							origin: ["right", "top"],
							offset: [1, 1],
							text: `JavaScript: ${get_js_version()} ${get_platform()}bit`,
							text_background: "#080400",
							text_background_alpha: .21,
							text_color: Color.white,
						}),
						cpu: new Component({
							type: "text",
							origin: ["right", "top"],
							offset: [1, 19],
							text: `CPU: ${navigator.hardwareConcurrency}x`,
							text_background: "#080400",
							text_background_alpha: .21,
							text_color: Color.white,
						}),
						display: new Component({
							type: "text",
							origin: ["right", "top"],
							offset: [1, 37],
							text: "",
							text_background: "#080400",
							text_background_alpha: .21,
							text_color: Color.white,
						}),
					},
				}),
			);

			document.body.appendChild(layer_set);

			for (let l of LAYERS) {l.load_textures(() => update_scale(l))}

			addEventListener("resize", () => {
				for (let l of LAYERS) {update_scale(l)}
			});
		})
		.catch(error => console.error(error));
})();