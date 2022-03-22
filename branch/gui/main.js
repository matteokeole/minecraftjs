import {Layer} from "./class/Layer.js";
import {Component} from "./class/Component.js";
import {Slot} from "./class/Slot.js";
import {Item} from "./class/Item.js";
import {
	update_scale,
	get_fps,
	get_js_version,
	get_platform,
	render_health,
	render_hunger,
} from "./functions.js";
import "./listeners.js";
import {Settings, Player} from "./variables.js";

export const
	UI = {},
	Fetch = {
		font: undefined,
		items: undefined,
	};

const required_textures = [
	"assets/font.json",
	"assets/items.json",
];

update_scale();

(() => {
	// Check for Fetch API browser compatibility
	if (!"fetch" in window) return console.error("This browser doesn't support Fetch API.");

	// Request resource files
	Promise
		.all(required_textures.map(t => fetch(`../../${t}`).then(response => response.json())))
		.then(response => {
			Fetch.font = response[0];
			Fetch.items = response[1];

			UI.debug = new Layer({
				name: "debug",
				visible: 0,
				components: {
					debug_title: new Component({
						type: "text",
						origin: ["left", "top"],
						offset: [1, 1],
						text: "Minecraft JS (pre-alpha 220319)",
						text_background: "#080400",
						text_background_alpha: .21,
						text_color: Fetch.font.color.white,
					}),
					debug_fps: new Component({
						type: "text",
						origin: ["left", "top"],
						offset: [1, 10],
						text: get_fps(),
						text_background: "#080400",
						text_background_alpha: .21,
						text_color: Fetch.font.color.white,
					}),
					debug_xyz: new Component({
						type: "text",
						origin: ["left", "top"],
						offset: [1, 28],
						text: "XYZ: 0.000 / 0.00000 / 0.000",
						text_background: "#080400",
						text_background_alpha: .21,
						text_color: Fetch.font.color.white,
					}),
					debug_block: new Component({
						type: "text",
						origin: ["left", "top"],
						offset: [1, 37],
						text: "Block: 0 0 0",
						text_background: "#080400",
						text_background_alpha: .21,
						text_color: Fetch.font.color.white,
					}),
					debug_chunk: new Component({
						type: "text",
						origin: ["left", "top"],
						offset: [1, 46],
						text: "Chunk: 0 0 0",
						text_background: "#080400",
						text_background_alpha: .21,
						text_color: Fetch.font.color.white,
					}),
					debug_facing: new Component({
						type: "text",
						origin: ["left", "top"],
						offset: [1, 55],
						text: "Facing: - (Towards - -) (0 / 0)",
						text_background: "#080400",
						text_background_alpha: .21,
						text_color: Fetch.font.color.white,
					}),
					debug_js: new Component({
						type: "text",
						origin: ["right", "top"],
						offset: [1, 1],
						text: `JavaScript: ${get_js_version()} ${get_platform()}bit`,
						text_background: "#080400",
						text_background_alpha: .21,
						text_color: Fetch.font.color.white,
					}),
					debug_cpu: new Component({
						type: "text",
						origin: ["right", "top"],
						offset: [1, 19],
						text: `CPU: ${navigator.hardwareConcurrency}x`,
						text_background: "#080400",
						text_background_alpha: .21,
						text_color: Fetch.font.color.white,
					}),
					debug_display: new Component({
						type: "text",
						origin: ["right", "top"],
						offset: [1, 37],
						text: `Display: ${window.innerWidth}x${window.innerHeight}`,
						text_background: "#080400",
						text_background_alpha: .21,
						text_color: Fetch.font.color.white,
					}),
				},
			});
			UI.debug.update();

			UI.crosshair = new Layer({
				name: "crosshair",
				components: {
					crosshair: new Component({
						origin: ["center", "center"],
						offset: [0, 0],
						size: [9, 9],
						texture: "gui/icons.png",
						uv: [3, 3],
					}),
				},
			});
			UI.crosshair.update();

			UI.container = new Layer({
				name: "container",
				visible: 0,
				components: {
					inventory: new Component({
						type: "container",
						origin: ["center", "center"],
						offset: [0, 0],
						size: [176, 166],
						texture: "gui/container/inventory.png",
						uv: [0, 0],
						slots: Array.from({length: 9}, (_, i) => {
							return new Slot({
								origin: ["left", "bottom"],
								offset: [7 + i * 18, 7],
							});
						}),
					}),
				}
			});
			const
				diamond_sword = new Item(719),
				bread = new Item(737);
			UI.container.components.inventory.slots[0].assign(diamond_sword);
			UI.container.components.inventory.slots[8].assign(bread);
			UI.container.update();

			const tooltip = document.querySelector(".tooltip");
			UI.tooltip = new Layer({
				name: "tooltip",
				visible: 1,
				parent: tooltip,
				components: {
					display_name: new Component({
						type: "text",
						origin: ["left", "top"],
						offset: [1, 1],
						text: "",
						text_color: Fetch.font.color.white,
						text_shadow: true,
					}),
					name: new Component({
						type: "text",
						origin: ["left", "top"],
						offset: [1, 13],
						text: "",
						text_color: Fetch.font.color.dark_gray,
						text_shadow: true,
					}),
				},
			});
			UI.tooltip.update();

			UI.hud = new Layer({
				name: "hud",
				components: {
					title: new Component({
						type: "text",
						origin: ["center", "top"],
						offset: [0, 8],
						text: "Press [F1] to toggle HUD.\nPress [F3] to toggle the debug screen.\nPress [Tab] to open inventory.",
						text_color: Fetch.font.color.gray,
						text_shadow: true,
					}),
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
					experience_bar: new Component({
						origin: ["center", "bottom"],
						offset: [0, 24],
						size: [182, 5],
						texture: "gui/icons.png",
						uv: [0, 64],
					}),
				},
			});
			render_health();
			render_hunger();
			setTimeout(UI.hud.update, 200);
		})
		.catch(error => console.error(error));
})();