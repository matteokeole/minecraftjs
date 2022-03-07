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
		escape: "Escape",
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
	SETTINGS = {
		ui_size: 4,
		autojump: false,
		borders: false,
	},
	// Player stats
	Player = {
		hearts: 10,
		maxHealth: 20,
		health: 20,
		maxHunger: 20,
		hunger: 20,
		inventory: Array(27),
		hotbar: Array(9),
	};

let
	WINDOW_WIDTH = window.innerWidth,
	WINDOW_HEIGHT = window.innerHeight,
	FIELD_OF_VIEW = 65;













const
	Scene				= new THREE.Scene(),
	Renderer			= new THREE.WebGLRenderer(),
	Camera				= new THREE.PerspectiveCamera(FIELD_OF_VIEW, WINDOW_WIDTH / WINDOW_HEIGHT, .1, 1000),
	Pointer				= new THREE.Vector2(),
	Raycaster			= new THREE.Raycaster(),
	Loader				= new THREE.TextureLoader(),
	Controls			= new THREE.PointerLockControls(Camera, document.body),
	BlockGeometry		= new THREE.BoxGeometry(1, 1, 1),
	BlockMaterial = ([
		"sand",	// Right
		"sand",	// Left
		"sand",	// Top
		"sand",	// Bottom
		"sand",	// Front
		"sand",	// Back
	]).map(face => {
		const map = Loader.load(`assets/textures/block/${face}.png`);
		map.magFilter = THREE.NearestFilter;
		return new THREE.MeshBasicMaterial({map: map});
	}),
	Faces = [
		{dir: [1, 0, 0, "right"]},
		{dir: [-1, 0, 0, "left"]},
		{dir: [0, 1, 0, "top"]},
		{dir: [0, -1, 0, "bottom"]},
		{dir: [0, 0, 1, "front"]},
		{dir: [0, 0, -1, "back"]},
	],
	// Selector mesh elements
	SelectorMaterial = new THREE.MeshBasicMaterial({transparent: true, opacity: 0}),
	SelectorOutline = new THREE.LineSegments(
		new THREE.EdgesGeometry(BlockGeometry),
		new THREE.LineBasicMaterial({color: 0x000000, linewidth: 4})
	),
	Selector = new THREE.Mesh(BlockGeometry, SelectorMaterial);