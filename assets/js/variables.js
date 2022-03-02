const
	u = 1, // Block size
	fps = 60,
	// Generation
	amplitude = 8,
	inc = .05,
	// Chunks
	chunkSize = 10,
	// Distances
	renderDistance = 3,
	selectionDistance = 4.5,
	// Fog
	fogBlend = 1,
	fogDistance = 10,
	// Movement
	movingSpeed = .1125,
	acc = .115,
	// Player keybinds
	Keybinds = {
		jump: "Space",
		strafe_left: "KeyA",
		strafe_right: "KeyD",
		walk_forwards: "KeyW",
		walk_backwards: "KeyS",
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
		open_inventory: "KeyI",
	},
	// Player settings
	Settings = {
		autojump: false,
		borders: true,
	},
	// Player stats
	Player = {
		maxHealth: 20,
		health: 20,
		maxHunger: 20,
		hunger: 20,
	};