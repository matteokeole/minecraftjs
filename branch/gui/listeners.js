import {UI} from "./main.js";
import {update_scale, render_hotbar_selector} from "./functions.js";
import {Slot} from "./class/Slot.js";
import {Keybinds, Can, Settings} from "./variables.js";

let
	scale_timeout,
	keys = [],
	debug_visible = 0,
	selected_slot = 0,
	slot_key = false,
	previous_slot = {};

addEventListener("contextmenu", e => e.preventDefault());

addEventListener("resize", () => {
	clearTimeout(scale_timeout);
	scale_timeout = setTimeout(() => {
		UI.debug.components.debug_display.text = `Display: ${window.innerWidth}x${window.innerHeight}`;

		update_scale();
	}, 50);
});

addEventListener("keydown", e => {
	if (e.code === "F3") e.preventDefault();

	const tooltip = document.querySelector(".tooltip");

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

			if (!UI.container.visible) {
				UI.tooltip.toggle(0);
			}

			break;

		case keys.includes(Keybinds.escape) && Boolean(UI.container.visible):
			UI.container.toggle();
			
			UI.tooltip.toggle(0);

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

addEventListener("mousemove", e => {
	const
		slot = Slot.get_slot_at(UI.container.components.inventory, e.clientX, e.clientY),
		tooltip = document.querySelector(".tooltip");

	UI.tooltip.toggle(0);

	if (previous_slot.id) {
		// Clear previous slot
		UI.container.ctx.fillStyle = "#8D8D8D";
		UI.container.ctx.fillRect(
			previous_slot.x + Settings.gui_scale,
			previous_slot.y + Settings.gui_scale,
			previous_slot.inner_size[0],
			previous_slot.inner_size[1],
		);

		previous_slot = {};
	}

	if (slot) {
		if (slot.id !== previous_slot.id) {
			previous_slot = slot;

			// Draw current slot
			UI.container.ctx.fillStyle = "#C5C5C5";
			UI.container.ctx.fillRect(
				slot.x + Settings.gui_scale,
				slot.y + Settings.gui_scale,
				slot.inner_size[0],
				slot.inner_size[1],
			);
		}

		if (slot.item && UI.container.visible) {
			UI.tooltip.components.display_name.text = slot.item.display_name;
			UI.tooltip.redraw("display_name");

			UI.tooltip.components.name.text = `minecraft:${slot.item.name}`;
			UI.tooltip.redraw("name");

			UI.tooltip.resize(
				Math.max.apply(Math, Object.values(UI.tooltip.components).map(c => c.w)) + Settings.gui_scale * 2,
				(UI.tooltip.components.display_name.h + Settings.gui_scale * 3) * Object.values(UI.tooltip.components).length,
			);

			tooltip.style.cssText = `
				width: ${UI.tooltip.w}px;
				height: ${UI.tooltip.h}px;
				left: ${e.clientX + 9 * Settings.gui_scale}px;
				top: ${e.clientY - 15 * Settings.gui_scale}px;
			`;

			UI.tooltip.toggle(1);
		}
	}
});