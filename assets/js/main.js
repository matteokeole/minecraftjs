import {Layer} from "./Layer.js";
import {Component} from "./Component.js";
import {Slot} from "./Slot.js";
import {Item} from "./Item.js";

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
		let now = performance.now();
		frame++;

		if (now - startTime > 1000) {
			UI.debug.components.fps.text = `${(frame / ((now - startTime) / 1000)).toFixed(0)} fps`;
			UI.debug.redraw("fps");

			startTime = now;
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
	get_registry_size = () => {
		return (
			navigator.userAgent.indexOf("WOW64") !== -1 ||
			navigator.userAgent.indexOf("Win64") !== -1 ||
			navigator.platform === "Win64"
		) ? 64 : 32;
	},
	UI = {},
	resources = [
		"assets/font.json",
		"assets/items.json",
	],
	Font = {},
	Keybind = {
		escape: "Escape",
		walk_forwards: "KeyW",
		walk_backwards: "KeyS",
		strafe_left: "KeyA",
		strafe_right: "KeyD",
		jump: "Space",
		toggle_hud: "F1",
		toggle_debug: "F3",
		open_inventory: "Tab",
		hotbar_slots: [
			"Digit1",
			"Digit2",
			"Digit3",
			"Digit4",
			"Digit5",
			"Digit6",
			"Digit7",
			"Digit8",
			"Digit9",
		],
	},
	Player = {
		permissions: {
			open_inventory: true,
			toggle_hud: true,
			toggle_debug: true,
			toggle_pause: true,
		},
	},
	add_keybind = k => {
		keys.indexOf(k.code) === -1 && keys.push(k.code);
		switch (k.code) {
			case Keybind.toggle_hud:
				if (!UI.inventory.visible && !UI.pause.visible && Player.permissions.toggle_hud) {
					UI.hud.toggle();
					UI.crosshair.toggle();
					UI.debug.toggle(debug_visible && UI.hud.visible);
				}
				Player.permissions.toggle_hud = false;
				break;
			case Keybind.open_inventory:
				if (!UI.pause.visible && Player.permissions.open_inventory) UI.inventory.toggle();
				Player.permissions.open_inventory = false;
				hovered_slot && UI.inventory.components.player_inventory.draw_slot(hovered_slot);
				break;
			case Keybind.toggle_debug:
				if (!UI.inventory.visible && !UI.pause.visible && Player.permissions.toggle_debug) {
					debug_visible = !debug_visible;
					UI.hud.visible && UI.debug.toggle();
				}
				Player.permissions.toggle_debug = false;
				break;
			case Keybind.escape:
				if (UI.inventory.visible) UI.inventory.toggle(0);
				else if (Player.permissions.toggle_pause) UI.pause.toggle();
				Player.permissions.toggle_pause = false;
				break;
			case Keybind.hotbar_slots[0]:
				let prev_slot = selected_slot;
				selected_slot = 0;
				select_hotbar_slot(prev_slot, selected_slot);
				break;
		}
		if (!UI.inventory.visible && !UI.pause.visible) {
			for (let s in Keybind.hotbar_slots) {
				if (k.code === Keybind.hotbar_slots[s]) {
					let prev_slot = selected_slot;
					selected_slot = s;
					select_hotbar_slot(prev_slot, selected_slot);
					break;
				}
			}
		}
	},
	remove_keybind = k => {
		// Reset permissions
		Player.permissions.open_inventory = true;
		Player.permissions.toggle_hud = true;
		Player.permissions.toggle_debug = true;
		Player.permissions.toggle_pause = true;
		keys.splice(keys.indexOf(k.code), 1);
	},
	select_hotbar_slot = (p, n) => {
		let h = UI.hud.components.hotbar,
			s = UI.hud.components.selector;
		UI.hud.erase(UI.hud.components.selector);
		UI.hud.ctx.drawImage(
			LOADED_TEXTURES[h.texture],
			h.uv[0] + (p * 20) - 1,
			h.uv[1],
			s.size[0],
			h.size[1],
			s.x,
			s.y + scale,
			s.w,
			s.h - scale * 2,
		);
		s.offset[0] = -80 + 20 * n;
		UI.hud.compute(s).draw(s);
	},
	hover_slot = e => {
		let inventory = UI.inventory.components.player_inventory;
		hovered_slot = Slot.get_slot_at(inventory, e);
		if (prev_hovered_slot) {
			inventory.draw_slot(prev_hovered_slot);
			prev_hovered_slot = false;
		}
		if (hovered_slot) {
			if (typeof prev_hovered_slot !== "object" || hovered_slot.id !== prev_hovered_slot.id) {
				prev_hovered_slot = hovered_slot;
				inventory.draw_slot(hovered_slot, true);
			}
		}
	};

export let
	Items,
	Color,
	keys = [],
	gui_scale = 2,
	selected_slot = 0,
	prev_hovered_slot = false,
	hovered_slot = false,
	scale = gui_scale,
	debug_visible = true,
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
			Items = response[1];
			Color = response[0].color;

			UI.hud = new Layer({
				name: "hud",
				components: {
					hotbar: new Component({
						type: "container",
						origin: ["center", "bottom"],
						offset: [0, 0],
						size: [182, 22],
						texture: "gui/widgets.png",
						uv: [0, 0],
					}),
					selector: new Component({
						origin: ["center", "bottom"],
						offset: [-80 + selected_slot * 20, -1],
						size: [24, 24],
						texture: "gui/widgets.png",
						uv: [0, 22],
					}),
				},
			});
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
				}
			});
			UI.debug = new Layer({
				name: "debug",
				visible: debug_visible,
				components: {
					version: new Component({
						type: "text",
						origin: ["left", "top"],
						offset: [1, 1],
						text: "Minecraft JS (pre-alpha 220322)",
						text_background: "#080400",
						text_background_alpha: .21,
						text_color: Color.white,
					}),
					fps: new Component({
						type: "text",
						origin: ["left", "top"],
						offset: [1, 10],
						text: get_fps(),
						text_background: "#080400",
						text_background_alpha: .21,
						text_color: Color.white,
					}),
					xyz: new Component({
						type: "text",
						origin: ["left", "top"],
						offset: [1, 28],
						text: "XYZ: 0.000 / 0.00000 / 0.000",
						text_background: "#080400",
						text_background_alpha: .21,
						text_color: Color.white,
					}),
					block: new Component({
						type: "text",
						origin: ["left", "top"],
						offset: [1, 37],
						text: "Block: 0 0 0",
						text_background: "#080400",
						text_background_alpha: .21,
						text_color: Color.white,
					}),
					chunk: new Component({
						type: "text",
						origin: ["left", "top"],
						offset: [1, 46],
						text: "Chunk: 0 0 0",
						text_background: "#080400",
						text_background_alpha: .21,
						text_color: Color.white,
					}),
					facing: new Component({
						type: "text",
						origin: ["left", "top"],
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
						text: `JavaScript: ${get_js_version()} ${get_registry_size()}bit`,
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
			});
			UI.inventory = new Layer({
				name: "inventory",
				components: {
					player_inventory: new Component({
						type: "container",
						origin: ["center", "center"],
						offset: [0, 0],
						size: [176, 166],
						texture: "gui/container/inventory.png",
						uv: [0, 0],
						slots: [].concat(
							Array.from({length: 27}, (_, i) => new Slot({
								type: "storage",
								offset: [
									7 + (i % 9) * 18,
									83 + Math.floor(i / 9) * 18,
								],
							})),
							Array.from({length: 9}, (_, i) => new Slot({
								type: "hotbar",
								offset: [
									7 + i * 18,
									141,
								],
							})),
						),
					}),
				},
			});
			UI.pause = new Layer({
				name: "pause",
				visible: 0,
				components: {
					title: new Component({
						type: "text",
						origin: ["center", "top"],
						offset: [0, 9],
						text: "Game Paused",
						text_color: Color.white,
						text_shadow: true,
					}),
				},
			});

			const
				pumpkin_pie = new Item(960),
				bread = new Item(737);
			UI.inventory.components.player_inventory.slots[34].assign(pumpkin_pie);
			UI.inventory.components.player_inventory.slots[35].assign(bread);

			UI.hud.components.hotbar.clone_slots_of(
				UI.inventory.components.player_inventory.slots.filter(s => s.type === "hotbar"),
				(s, i) => {
					s.origin = ["left", "top"];
					s.offset = [-80 + 20 * i];
				},
				UI.inventory.components.player_inventory
			);

			document.body.appendChild(layer_set);

			Object.values(UI).forEach(l => {
				l.load_textures(() => update_scale(l));
			});

			addEventListener("keydown", e => {
				if (e.code === "F3" || e.code === "Tab" || e.code === "Digit4") e.preventDefault();
				add_keybind(e);
			});
			addEventListener("keyup", e => remove_keybind(e));
			addEventListener("resize", () => {
				Object.values(UI).forEach(l => update_scale(l));
			});
			addEventListener("wheel", e => {
				if (!UI.inventory.visible && !UI.pause.visible) {
					let prev_slot = selected_slot;
					selected_slot = e.deltaY > 0 ? (selected_slot < 8 ? ++selected_slot : 0) : (selected_slot > 0 ? --selected_slot : 8);
					select_hotbar_slot(prev_slot, selected_slot);
				}
			});
			UI.inventory.canvas.addEventListener("mousemove", e => hover_slot(e));
		})
		.catch(error => console.error(error));
})();