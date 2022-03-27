import {Layer} from "./Layer.js";
import {Component} from "./Component.js";
import {Slot} from "./Slot.js";
import {Item} from "./Item.js";

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
		"assets/font.json",
		"assets/items.json",
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
				TEXTURES[i].src = `assets/textures/${i}`;
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
	get_fps = () => {
		let now = performance.now();
		fps_frames++;

		if (now - fps_start_time > 1000) {
			UI.debug.components.fps.text = `${(fps_frames / ((now - fps_start_time) / 1000)).toFixed(0)} fps`;
			UI.debug.redraw("fps");

			fps_start_time = now;
			fps_frames = 0;
		}

		requestAnimationFrame(get_fps);
	},
	get_js_version = () => {
		for (let i = 1; i <= 9; i++) {
			// Create a new script
			let script = document.createElement("script");

			script.setAttribute("language", `javascript1.${i}`);
			script.textContent = `js_version = 1.${i}`;

			document.body.appendChild(script);

			// Remove the script when the version is obtained
			script.remove();
		}

		return js_version;
	},
	get_registry_size = () => {
		return (
			navigator.userAgent.indexOf("Win64") !== -1 ||
			navigator.userAgent.indexOf("WOW64") !== -1 ||
			navigator.platform === "Win64"
		) ? 64 : 32;
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
				if (!UI.inventory.visible) UI.tooltip.toggle(0);
				Player.permissions.open_inventory = false;
				slot_hovered && slot_hovered.render_item();
				break;
			case Keybind.toggle_debug:
				if (!UI.inventory.visible && !UI.pause.visible && Player.permissions.toggle_debug) {
					debug_visible = !debug_visible;
					UI.hud.visible && UI.debug.toggle();
				}
				Player.permissions.toggle_debug = false;
				break;
			case Keybind.escape:
				if (UI.inventory.visible) {
					UI.inventory.toggle(0);
					UI.tooltip.toggle(0);
				}
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
			TEXTURES[h.texture],
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
		h.slots.forEach(s => s.render_item());
	},
	// DOM elements
	LayerFragment = document.createDocumentFragment(),
	Tooltip = document.createElement("div"),
	// Data objects
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
	ReferenceSlots = {
		hotbar: Array.from({length: 9}, (_, i) => {
			return new Slot({
				type: "hotbar",
			});
		}),
	},
	Visibilities = ["hidden", "visible"];

export let
	Items, // Fetched item list
	Color, // Fetched color list
	layer_values, // Array of layers
	keys = [], // Current pressed keys
	gui_scale = 2, // Preferred interface scale
	scale = gui_scale, // Current interface scale
	selected_slot = 0, // Index of the current hotbar slot
	slot_hovered_prev = false, // Index of the previously selected hotbar slot
	slot_hovered = false, // Hovered slot reference
	debug_visible = false, // Is debug menu visible
	fps_start_time = performance.now(), // For FPS counter
	fps_frames = 0; // For FPS counter

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
			Items = response[1];
			calc_scale();

			// HUD layer
			UI.hud = new Layer({
				name: "hud",
				components: {
					hotbar: new Component({
						type: "container",
						origin: ["center", "bottom"],
						size: [182, 22],
						texture: "gui/widgets.png",
						slots: Array.from({length: 9}, (_, i) => new Slot({
							type: "hotbar",
							offset: [
								2 + i * 20,
								2,
							],
							refer_to: ReferenceSlots.hotbar[i],
						})),
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

			// Crosshair layer
			UI.crosshair = new Layer({
				name: "crosshair",
				components: {
					crosshair: new Component({
						origin: ["center", "center"],
						size: [9, 9],
						texture: "gui/icons.png",
						uv: [3, 3],
					}),
				},
			});

			// Debug menu layer
			UI.debug = new Layer({
				name: "debug",
				visible: debug_visible,
				components: {
					version: new Component({
						type: "text",
						offset: [1, 1],
						text: "Minecraft JS (pre-alpha 220324)",
						text_background: "#080400",
						text_background_alpha: .21,
					}),
					fps: new Component({
						type: "text",
						offset: [1, 10],
						text: get_fps(),
						text_background: "#080400",
						text_background_alpha: .21,
					}),
					xyz: new Component({
						type: "text",
						offset: [1, 28],
						text: "XYZ: 0.000 / 0.00000 / 0.000",
						text_background: "#080400",
						text_background_alpha: .21,
					}),
					block: new Component({
						type: "text",
						offset: [1, 37],
						text: "Block: 0 0 0",
						text_background: "#080400",
						text_background_alpha: .21,
					}),
					chunk: new Component({
						type: "text",
						offset: [1, 46],
						text: "Chunk: 0 0 0",
						text_background: "#080400",
						text_background_alpha: .21,
					}),
					facing: new Component({
						type: "text",
						offset: [1, 55],
						text: "Facing: - (Towards - -) (0 / 0)",
						text_background: "#080400",
						text_background_alpha: .21,
					}),
					js: new Component({
						type: "text",
						origin: ["right", "top"],
						offset: [1, 1],
						text: `JavaScript: ${get_js_version()} ${get_registry_size()}bit`,
						text_background: "#080400",
						text_background_alpha: .21,
					}),
					cpu: new Component({
						type: "text",
						origin: ["right", "top"],
						offset: [1, 19],
						text: `CPU: ${navigator.hardwareConcurrency}x`,
						text_background: "#080400",
						text_background_alpha: .21,
					}),
					display: new Component({
						type: "text",
						origin: ["right", "top"],
						offset: [1, 37],
						text: "Display:",
						text_background: "#080400",
						text_background_alpha: .21,
					}),
				},
			});

			// Inventory layer
			UI.inventory = new Layer({
				name: "inventory",
				visible: 0,
				components: {
					player_inventory: new Component({
						type: "container",
						origin: ["center", "center"],
						size: [176, 166],
						texture: "gui/container/inventory.png",
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
								refer_to: ReferenceSlots.hotbar[i],
							})),
						),
					}),
				},
			});

			// Tooltip layer
			UI.tooltip = new Layer({
				name: "tooltip",
				visible: 0,
				parent: Tooltip,
				components: {
					display_name: new Component({
						type: "text",
						text: "",
						text_shadow: true,
					}),
					name: new Component({
						type: "text",
						offset: [0, 12],
						text: "",
						color: Color.dark_gray,
						text_shadow: true,
					}),
				},
			});
			Tooltip.id = "tooltip";
			LayerFragment.appendChild(Tooltip);

			// Pause menu layer
			UI.pause = new Layer({
				name: "pause",
				visible: 0,
				components: {
					title: new Component({
						type: "text",
						origin: ["center", "top"],
						offset: [0, 9],
						text: "Game Paused",
						text_shadow: true,
					}),
				},
			});

			// Get UI content as an array
			layer_values = Object.values(UI);

			load_textures(() => {
				// Textures loaded
				document.body.appendChild(LayerFragment);

				let pumpkin_pie = new Item(960), bread = new Item(737);
				ReferenceSlots.hotbar[7].assign(bread);
				ReferenceSlots.hotbar[8].assign(pumpkin_pie);

				// Keydown event
				addEventListener("keydown", e => {
					if (
						e.code === "F1" ||
						e.code === "F3" ||
						e.code === "Tab" ||
						e.code === "Digit4"
					) e.preventDefault();
					add_keybind(e);
				});

				// Keyup event
				addEventListener("keyup", e => remove_keybind(e));

				// Window resize event
				addEventListener("resize", () => {
					// Update layers with the new scale
					calc_scale();
					layer_values.forEach(l => update_scale(l));
				});

				// Right click event
				addEventListener("contextmenu", e => e.preventDefault());

				// Mouse wheel event
				addEventListener("wheel", e => {
					if (!UI.inventory.visible && !UI.pause.visible) {
						let prev_slot = selected_slot;
						selected_slot = e.deltaY > 0 ? (selected_slot < 8 ? ++selected_slot : 0) : (selected_slot > 0 ? --selected_slot : 8);
						select_hotbar_slot(prev_slot, selected_slot);
					}
				});

				// Mouse move event (only for the inventory layer)
				addEventListener("mousemove", e => {
					if (UI.inventory.visible) {
						slot_hovered = Slot.get_slot_at(UI.inventory.components.player_inventory, e, false);

						// Clear the previous hovered slot, if there is one
						if (slot_hovered_prev && slot_hovered.id !== slot_hovered_prev.id) {
							slot_hovered_prev.leave();
							slot_hovered_prev = false;
						}

						if (!slot_hovered || !slot_hovered.refer_to && !slot_hovered.item) UI.tooltip.toggle(0);

						// Hover the slot found at the cursor coordinates, if there is one
						if (slot_hovered && slot_hovered.id !== slot_hovered_prev.id) {
							slot_hovered.hover();
							slot_hovered_prev = slot_hovered;

							if (slot_hovered.refer_to) {
								if (slot_hovered.refer_to.item) {
									UI.tooltip.components.display_name.text = slot_hovered.refer_to.item.display_name;
									UI.tooltip.redraw("display_name");
									UI.tooltip.components.name.text = `minecraft:${slot_hovered.refer_to.item.name}`;
									UI.tooltip.redraw("name");

									let max_width = Object.values(UI.tooltip.components).map(c => c.w);
									Tooltip.style.width = `${Math.max(...max_width)}px`;
									Tooltip.style.height = `${20 * scale}px`;

									UI.tooltip.toggle(1);
								} else UI.tooltip.toggle(0);
							}
						}

						Tooltip.style.left = `${e.clientX + 9 * scale}px`;
						Tooltip.style.top = `${e.clientY - 15 * scale}px`;
					}
				});

				// Left click event (only for the inventory layer)
				UI.inventory.canvas.addEventListener("click", e => {
					let slot = Slot.get_slot_at(UI.inventory.components.player_inventory, e);

					slot && slot.reference_for && slot.empty();
				});
			});
		})
		.catch(error => console.error(error));
})();