import {Interface} from "./main.js";
import {getAutoScale} from "./functions.js";
import {Keybinds, Can} from "./variables.js";

let updateScale, keys = [], debug_visible = 0;

addEventListener("contextmenu", e => e.preventDefault());

addEventListener("resize", () => {
	clearTimeout(updateScale);
	updateScale = setTimeout(() => {
		Interface.debug.components.debug_display.text = `Display: ${window.innerWidth}x${window.innerHeight}`;

		Interface.debug.canvas.width = window.innerWidth;
		Interface.debug.size.x = window.innerWidth;
		Interface.debug
			.setScale(getAutoScale())
			.update();

		Interface.crosshair
			.setScale(getAutoScale())
			.update();

		Interface.hud
			.setScale(getAutoScale())
			.update();
	}, 50);
});

addEventListener("keydown", e => {
	if (!/^(ControlLeft|F(5|11|12))$/.test(e.code)) e.preventDefault();

	// Add keybind to key list
	keys.push(e.code);

	switch (true) {
		case keys.includes(Keybinds.toggle_hud) && Can.toggle_hud:
			Can.toggle_hud = false;

			Interface.crosshair.toggle();
			Interface.hud.toggle();
			Interface.debug.toggle(debug_visible && Interface.hud.visible);

			break;

		case keys.includes(Keybinds.toggle_debug) && Can.toggle_debug:
			Can.toggle_debug = false;

			debug_visible = !debug_visible;
			Interface.debug.toggle(debug_visible && Interface.hud.visible);

			break;
	}

	// Remove keybind from key list
	keys.splice(e.code, 1);
});

addEventListener("keyup", () => {
	Can.toggle_hud = true;
	Can.toggle_debug = true;
});