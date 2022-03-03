const
	UIElement = function([w, h], [x, y, z = 0], [tsrc, uv], id) {
		// Width & height in px
		this.w = w * UI_SIZE;
		this.h = h * UI_SIZE;
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
			width: ${this.w}px;
			height: ${this.h}px;
			margin: auto;
			left: ${WINDOW_WIDTH / 2 - (this.w / 2) + x}px;
			top: ${WINDOW_HEIGHT / 2 - (this.h / 2) - y}px;
			position: absolute;
			background-color: transparent;
			background-image: url(assets/textures/${tsrc});
			background-position: ${-this.uv[0]}px ${-this.uv[1]}px;
			background-size: 100%;
			image-rendering: pixelated;
			z-index: ${this.z};
		`;

		this.setPosition = function(x, y) {
			x = (x === undefined) ? this.x : x;
			y = (y === undefined) ? this.y : y;
			// Update element position
			this.element.style.left = `${WINDOW_WIDTH / 2 - (this.w / 2) + x}px`;
			this.element.style.top = `${WINDOW_HEIGHT / 2 - (this.h / 2) - y}px`;
		}

		document.body.append(this.element);

		// Load interface texture
		const TEXTURE = new Image();
		TEXTURE.addEventListener("load", () => {
			this.texture.w = TEXTURE.width;
			this.texture.h = TEXTURE.height;
			this.element.style.backgroundSize = `${this.texture.w * 2}px`;
		});
		TEXTURE.src = this.texture.src;
	},
	toggleInventory = () => {
		let container = document.querySelector("#inventory_container");
		if (inventoryOpened) container.style.display = "block";
		else container.style.display = "none";
	},
	crosshair = new UIElement([4.5, 4.5], [0, 0], ["gui/icons.png", [1.25, 1.25]], "crosshair"),
	inventory_bar = new UIElement([91, 11], [0, -(WINDOW_HEIGHT / 2 - (11 / 2) * 4)], ["gui/widgets.png", [0, 0]], "inventory_bar"),
	inventory_bar_selector_slots = [-159, -119, -79, -39, 1, 41, 81, 121, 161],
	hearth_slots = [-173, -157, -141, -125, -109, -93, -77, -61, -45, -29],
	hunger_slots = [173, 157, 141, 125, 109, 93, 77, 61, 45, 29],
	inventory_bar_selector = new UIElement([12, 12], [inventory_bar_selector_slots[0], -(WINDOW_HEIGHT / 2 - (11 / 2) * 4 + 1), 1], ["gui/widgets.png", [0, 44]], "inventory_bar_selector"),
	experience_bar = new UIElement([91, 2.5], [0, -(WINDOW_HEIGHT / 2 - (11 / 2) * 4 - 31)], ["gui/icons.png", [0, 128]], "experience_bar"),
	inventory_container = new UIElement([88, 83], [0, 0], ["gui/container/inventory.png", [0, 0]], "inventory_container");

const slots = {
	armor: Array.from({length: 4}, (_, i) => {
		return new Slot({
			id: i,
			x: -144,
			y: 134 - i * 36,
		});
	}),
	inventory: Array.from({length: 27}, (_, i) => {
		return new Slot({
			id: i,
			x: -144 + (i % 9) * 36,
			y: -18 - Math.floor(i / 9) * 36,
		});
	}),
	hotbar: Array.from({length: 9}, (_, i) => {
		return new Slot({
			id: i,
			x: -144 + i * 36,
			y: -134,
		});
	}),
};


let netherite_chestplate = new Item("Netherite Chestplate", "item/netherite_chestplate.png");
slots.armor[1].assign(netherite_chestplate);

let stone_sword = new Item("Stone Sword", "item/stone_sword.png");
slots.hotbar[0].assign(stone_sword);

let bread = new Item("Bread", "item/bread.png");
bread.setStack(17);
slots.hotbar[8].assign(bread);

// document.querySelector("#inventory_container").style.display = "none";

let selected_slot = 0,
	inventoryOpened = false;

// Set max health & max hunger
for (let i = 0; i < Player.maxHealth; i++) {
	if (i % 2 === 0) {
		let heart_outline = new UIElement([4.5, 4.5], [hearth_slots[i / 2], -(WINDOW_HEIGHT / 2 - (11 / 2) * 4 - 48)], ["gui/icons.png", [32, 0]], `heart-${i}`);
	}
}
for (let i = 0; i < Player.maxHunger; i++) {
	if (i % 2 === 0) {
		let hunger_outline = new UIElement([4.5, 4.5], [hunger_slots[i / 2], -(WINDOW_HEIGHT / 2 - (11 / 2) * 4 - 48)], ["gui/icons.png", [32, 54]], `hunger-${i}`);
	}
}

// Set health points
for (let i = 0; i < Player.health; i++) {
	if (i % 2 === 0) {
		let heart_inner = new UIElement([4, 3.5], [hearth_slots[i / 2] + 1, -(WINDOW_HEIGHT / 2 - (11 / 2) * 4 - 48)], ["gui/icons.png", [106, 2]], `heart-${i}`);
	}
}

// Set hunger points
for (let i = 0; i < Player.hunger; i++) {
	if (i % 2 === 0) {
		let hunger_inner = new UIElement([3.5, 3.5], [hunger_slots[i / 2], -(WINDOW_HEIGHT / 2 - (11 / 2) * 4 - 48)], ["gui/icons.png", [106, 56]], `hunger-${i}`);
	}
}