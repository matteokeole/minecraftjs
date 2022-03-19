import {UI} from "./main.js";
import {get_auto_scale, render_hotbar_selector} from "./functions.js";
import {Keybinds, Can} from "./variables.js";

let
	updateScale,
	keys = [],
	debug_visible = 0,
	selected_slot = 0,
	slot_key = false;

addEventListener("contextmenu", e => e.preventDefault());

addEventListener("resize", () => {
	clearTimeout(updateScale);
	updateScale = setTimeout(() => {
		UI.debug.components.debug_display.text = `Display: ${window.innerWidth}x${window.innerHeight}`;

		UI.debug
			.set_size()
			.set_scale(get_auto_scale())
			.update();

		UI.crosshair
			.set_size()
			.set_scale(get_auto_scale())
			.update();

		UI.hud
			.set_size()
			.set_scale(get_auto_scale())
			.update();

		UI.container
			.set_size()
			.set_scale(get_auto_scale())
			.update();
	}, 50);
});

addEventListener("keydown", e => {
	if (!/^(ControlLeft|F(5|11|12))$/.test(e.code)) e.preventDefault();

	// Add keybind to key list
	keys.push(e.code);

	switch (true) {
		case keys.includes(Keybinds.toggle_hud) && Can.toggle_hud && !UI.container.visible:
			Can.toggle_hud = false;

			UI.crosshair.toggle();
			UI.hud.toggle();
			UI.debug.toggle(debug_visible && UI.hud.visible);

			break;

		case keys.includes(Keybinds.toggle_debug) && Can.toggle_debug && !UI.container.visible:
			Can.toggle_debug = false;

			debug_visible = !debug_visible;
			UI.debug.toggle(debug_visible && UI.hud.visible);

			break;

		case keys.includes(Keybinds.open_inventory) && Can.open_inventory:
			Can.open_inventory = false;

			UI.container.toggle();

			break;
	}

	for (let i in Keybinds.hotbar_slots) {
		if (e.code === Keybinds.hotbar_slots[i]) slot_key = true;
	}

	if (slot_key) {
		slot_key = false;
		if (!UI.container.visible) {
			selected_slot = render_hotbar_selector(selected_slot, Keybinds.hotbar_slots.indexOf(e.code));
		}
	}
});

addEventListener("keyup", () => {
	keys = [];

	Can.toggle_hud = true;
	Can.toggle_debug = true;
	Can.open_inventory = true;
});

addEventListener("wheel", e => {
	if (!UI.container.visible) {
		selected_slot = render_hotbar_selector(
			selected_slot,
			e.deltaY > 0 ? (selected_slot < 8 ? ++selected_slot : 0) : (selected_slot > 0 ? --selected_slot : 8),
		);
	}
});