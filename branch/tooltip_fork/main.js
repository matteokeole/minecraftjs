import {Keybinds, Player} from "./variables.js";
import {Layer} from "./layer.js";
import {Component} from "./component.js";
import {Slot} from "./slot.js";
import {Item} from "./item.js";
import {getAutoScale, draw, erase, renderHealth, renderHunger, get_js_version, get_platform_architecture} from "./functions.js";
import "./listeners.js";

export const
	Fetch = {
		font: undefined,
		items: undefined,
	},
	Interface = {};

(() => {
	// Check for Fetch API browser compatibility
	if (!"fetch" in window) return console.error("This browser doesn't support Fetch API.");

	// Request resource files
	Promise
		.all([
			fetch("../../assets/font.json").then(r => r.json()),
			fetch("../../assets/items.json").then(r => r.json()),
		])
		.then(response => {
			Fetch.font = response[0];
			Fetch.items = response[1];

			Interface.debug = new Layer({
				name: "debug",
				visible: 0,
			});
			Interface.debug
				.add(
					new Component({
						name: "debug_title",
						type: "text",
						origin: ["left", "top"],
						offset: [1, 1],
						texture: "font/ascii.png",
						text: "Minecraft (220319)",
						text_background: "#080400",
						text_background_alpha: .21,
						text_color: Fetch.font.colors.white,
					})
				)
				.add(
					new Component({
						name: "debug_fps",
						type: "text",
						origin: ["left", "top"],
						offset: [1, 10],
						texture: "font/ascii.png",
						text: "60 fps",
						text_background: "#080400",
						text_background_alpha: .21,
						text_color: Fetch.font.colors.white,
					})
				)
				.add(
					new Component({
						name: "debug_chunks_c",
						type: "text",
						origin: ["left", "top"],
						offset: [1, 19],
						texture: "font/ascii.png",
						text: "Chunks[C] W: 0 E: 0",
						text_background: "#080400",
						text_background_alpha: .21,
						text_color: Fetch.font.colors.white,
					})
				)
				.add(
					new Component({
						name: "debug_chunks_s",
						type: "text",
						origin: ["left", "top"],
						offset: [1, 28],
						texture: "font/ascii.png",
						text: "Chunks[S] W: 0 E: 0",
						text_background: "#080400",
						text_background_alpha: .21,
						text_color: Fetch.font.colors.white,
					})
				)
				.add(
					new Component({
						name: "debug_xyz",
						type: "text",
						origin: ["left", "top"],
						offset: [1, 46],
						texture: "font/ascii.png",
						text: "XYZ: 0.000 / 0.000000 / 0.000",
						text_background: "#080400",
						text_background_alpha: .21,
						text_color: Fetch.font.colors.white,
					})
				)
				.add(
					new Component({
						name: "debug_block",
						type: "text",
						origin: ["left", "top"],
						offset: [1, 55],
						texture: "font/ascii.png",
						text: "Block: 0 0 0",
						text_background: "#080400",
						text_background_alpha: .21,
						text_color: Fetch.font.colors.white,
					})
				)
				.add(
					new Component({
						name: "debug_chunk",
						type: "text",
						origin: ["left", "top"],
						offset: [1, 64],
						texture: "font/ascii.png",
						text: "Chunk: 0 0 0",
						text_background: "#080400",
						text_background_alpha: .21,
						text_color: Fetch.font.colors.white,
					})
				)
				.add(
					new Component({
						name: "debug_facing",
						type: "text",
						origin: ["left", "top"],
						offset: [1, 73],
						texture: "font/ascii.png",
						text: "Facing: - (Towards -) (0 / 0)",
						text_background: "#080400",
						text_background_alpha: .21,
						text_color: Fetch.font.colors.white,
					})
				)
				.add(
					new Component({
						name: "debug_js",
						type: "text",
						origin: ["right", "top"],
						offset: [1, 1],
						texture: "font/ascii.png",
						text: `JavaScript: ${get_js_version()} ${get_platform_architecture()}bit`,
						text_background: "#080400",
						text_background_alpha: .21,
						text_color: Fetch.font.colors.white,
					})
				)
				.add(
					new Component({
						name: "debug_cpu",
						type: "text",
						origin: ["right", "top"],
						offset: [1, 19],
						texture: "font/ascii.png",
						text: `CPU: ${navigator.hardwareConcurrency}x`,
						text_background: "#080400",
						text_background_alpha: .21,
						text_color: Fetch.font.colors.white,
					})
				)
				.add(
					new Component({
						name: "debug_display",
						type: "text",
						origin: ["right", "top"],
						offset: [1, 37],
						texture: "font/ascii.png",
						text: `Display: ${window.innerWidth}x${window.innerHeight}`,
						text_background: "#080400",
						text_background_alpha: .21,
						text_color: Fetch.font.colors.white,
					})
				)
				.update();

			Interface.crosshair = new Layer({name: "crosshair"});
			Interface.crosshair
				.add(
					new Component({
						name: "crosshair",
						origin: ["center", "center"],
						size: [9, 9],
						texture: "gui/icons.png",
						uv: [3, 3],
					}),
				)
				.update();

			Interface.hud = new Layer({name: "hud"});
			Interface.hud
				.add(
					new Component({
						name: "title",
						type: "text",
						origin: ["center", "top"],
						offset: [0, 8],
						texture: "font/ascii.png",
						text: "Responsive GUI Demo (tooltip branch fork)\n\nPress [F1] to toggle the HUD.\nPress [F3] to toggle the debug screen.",
						text_color: Fetch.font.colors.black,
					})
				)
				.add(
					new Component({
						name: "hotbar",
						origin: ["center", "bottom"],
						size: [182, 22],
						texture: "gui/widgets.png",
						uv: [0, 0],
					}),
				)
				.add(
					new Component({
						name: "selector",
						origin: ["center", "bottom"],
						offset: [-80, -1],
						size: [24, 24],
						texture: "gui/widgets.png",
						uv: [0, 22],
					}),
				)
				.add(
					new Component({
						name: "experience_bar",
						origin: ["center", "bottom"],
						offset: [0, 24],
						size: [182, 5],
						texture: "gui/icons.png",
						uv: [0, 64],
					}),
				);

			renderHealth(Interface.hud);
			renderHunger(Interface.hud);
			
			Interface.hud.update();
		})
		.catch(error => console.error(error));
})();