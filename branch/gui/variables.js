export const
	Keybinds = {
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
	Can = {
		toggle_hud: true,
		toggle_debug: true,
		open_inventory: true,
	},
	Settings = {
		gui_scale: 2,
		advanced_tooltips: false,
	},
	Player = {
		max_health: 20,
		health: 15,
		max_hunger: 20,
		hunger: 17,
	},
	CONST = {
		DEFAULT_SCALE: 2,
	};

document.documentElement.style.setProperty("--scale", `${Settings.gui_scale}px`);