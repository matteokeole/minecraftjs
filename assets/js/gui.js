const
	UIElement = function([w, h], [x, y, z = 0], [tsrc, uv], id) {
		// Width & height in px
		this.width = w;
		this.height = h;
		this.x = x;
		this.y = y;
		this.z = z;
		this.texture = tsrc;
		this.uv = uv;
		this.id = id;
		this.texture = {
			src: `assets/textures/${tsrc}`,
			w: 0,
			h: 0,
		};
		this.element = document.createElement("div");
		this.element.id = this.id;
		this.element.style.cssText = `
			width: ${w}px;
			height: ${h}px;
			margin: auto;
			left: ${window.innerWidth / 2 - (w / 2) + x}px;
			top: ${window.innerHeight / 2 - (h / 2) + y}px;
			position: absolute;
			background-color: transparent;
			background-image: url(assets/textures/${tsrc});
			background-position: ${-uv[0]}px ${-uv[1]}px;
			background-repeat: no-repeat;
			image-rendering: pixelated;
			z-index: ${this.z};
			transform: scale(4);
		`;

		this.setPosition = function(x, y) {
			if (x === undefined) x = this.x;
			if (y === undefined) y = this.y;
			// Update element position
			this.element.style.left = `${window.innerWidth / 2 - (w / 2) + x}px`;
			this.element.style.top = `${window.innerHeight / 2 - (h / 2) + y}px`;
		}

		document.body.append(this.element);

		// Load interface texture
		const TEXTURE = new Image();
		TEXTURE.addEventListener("load", () => {
			this.texture.w = TEXTURE.width;
			this.texture.h = TEXTURE.height;
			this.element.style.backgroundSize = `${this.texture.w / 2}px`;
		});
		TEXTURE.src = this.texture.src;
	},
	toggleInventory = () => {
		let container = document.querySelector("#inventory_container");
		if (inventoryOpened) container.style.display = "block";
		else container.style.display = "none";
	},
	crosshair = new UIElement([4.5, 4.5], [0, 0], ["gui/widgets.png", [121.5, 1.5]], "crosshair"),
	inventory_bar = new UIElement([91, 11], [0, (window.innerHeight / 2 - (11 / 2) * 4)], ["gui/widgets.png", [0, 0]], "inventory_bar"),
	inventory_bar_selector_slots = [
		-159,
		-119,
		-79,
		-39,
		1,
		41,
		81,
		121,
		161,
	],
	hearth_slots = [
		-173,
		-157,
		-141,
		-125,
		-109,
		-93,
		-77,
		-61,
		-45,
		-29,
	],
	hunger_slots = [
		173,
		157,
		141,
		125,
		109,
		93,
		77,
		61,
		45,
		29,
	],
	inventory_bar_selector = new UIElement([12, 12], [inventory_bar_selector_slots[0], (window.innerHeight / 2 - (11 / 2) * 4 + 1), 1], ["gui/widgets.png", [0, 11]], "inventory_bar_selector"),
	experience_bar = new UIElement([91, 2.5], [0, (window.innerHeight / 2 - (11 / 2) * 4 - 31)],  ["gui/icons.png", [0, 32]], "experience_bar"),
	inventory_container = new UIElement([88, 83], [0, 0], ["gui/container/inventory.png", [0, 0]], "inventory_container");

const slots = {
	// armor: [],
	inventory: Array.from({length: 27}, (_, i) => {
		return {
			x: -144 + (i % 9) * 36,
			y: 18 + Math.floor(i / 9) * 36,
			item: null,
		};
	}),
	// hotbar: [],
};

for (let i of slots.inventory) {
	let slot = new UIElement([8, 8], [i.x, i.y], ["", []]);
}

let selected_slot = 0,
	inventoryOpened = false;

// Set max health & max hunger
for (let i = 0; i < Player.maxHealth; i++) {
	if (i % 2 === 0) {
		let heart_outline = new UIElement([4.5, 4.5], [hearth_slots[i / 2], (window.innerHeight / 2 - (11 / 2) * 4 - 48)], ["gui/icons.png", [8, 0]], `heart-${i}`);
	}
}
for (let i = 0; i < Player.maxHunger; i++) {
	if (i % 2 === 0) {
		let hunger_outline = new UIElement([4.5, 4.5], [hunger_slots[i / 2], (window.innerHeight / 2 - (11 / 2) * 4 - 48)], ["gui/icons.png", [8, 13.5]], `hunger-${i}`);
	}
}

// Set health points
for (let i = 0; i < Player.health; i++) {
	if (i % 2 === 0) {
		let heart_inner = new UIElement([4, 3.5], [hearth_slots[i / 2] + 1, (window.innerHeight / 2 - (11 / 2) * 4 - 48)], ["gui/icons.png", [26.5, .5]], `heart-${i}`);
	}
}

// Set hunger points
for (let i = 0; i < Player.hunger; i++) {
	if (i % 2 === 0) {
		let hunger_inner = new UIElement([3.5, 3.5], [hunger_slots[i / 2], (window.innerHeight / 2 - (11 / 2) * 4 - 48)], ["gui/icons.png", [26.5, 14]], `hunger-${i}`);
	}
}