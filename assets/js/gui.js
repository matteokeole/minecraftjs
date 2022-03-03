const
	gui = document.querySelector("canvas.gui"),
	ctx = gui.getContext("2d"),
	InterfaceComponent = function(id, obj, tsrc) {
		// Set object ID
		this.id = id;

		// Set object origin/size/uv
		this.origin = {
			x: obj.origin[0],
			y: obj.origin[1],
		};
		this.size = {
			x: obj.size[0],
			y: obj.size[1],
		};
		this.uv = {
			x: obj.uv[0],
			y: obj.uv[1],
		};

		// Load object texture
		this.texture = new Image();
		this.texture.addEventListener("load", () => {
			ctx.drawImage(
				this.texture,
				this.uv.x,
				this.uv.y,
				this.size.x / 2,
				this.size.y / 2,
				(WINDOW_WIDTH / 2) - (this.size.x / 2) + this.origin.x,
				(WINDOW_HEIGHT / 2) - (this.size.y / 2) - this.origin.y,
				this.size.x,
				this.size.y,
			);
		});
		this.texture.src = `assets/textures/${tsrc}`;

		this.setPosition = (x, y) => {};

		return this;
	},
	toggleInventory = () => {
		let container = document.querySelector("#inventory_container");
		if (inventoryOpened) container.style.display = "block";
		else container.style.display = "none";
	},
	crosshair = new InterfaceComponent(
		"crosshair",
		{
			origin: [0, 0],
			size: [18, 18],
			uv: [3, 3],
		},
		"gui/icons.png",
	),
	hotbar = new InterfaceComponent(
		"hotbar",
		{
			origin: [0, -(WINDOW_HEIGHT / 2) + 21],
			size: [364, 44],
			uv: [0, 0],
		},
		"gui/widgets.png",
	),
	experience_bar = new InterfaceComponent(
		"experience_bar",
		{
			origin: [0, -(WINDOW_HEIGHT / 2) + 52],
			size: [364, 10],
			uv: [0, 64],
		},
		"gui/icons.png",
	),
	health_bar = [
		Array.from({length: 10}, (_, i) => {
			return new InterfaceComponent(
				"heart_outline",
				{
					origin: [
						-173 + (i % 10) * 16,
						-(WINDOW_HEIGHT / 2) + 68 + Math.floor(i / 10) * 20,
					],
					size: [18, 18],
					uv: [16, 0],
				},
				"gui/icons.png",
			);
		}),
		Array.from({length: Player.hearts}, (_, i) => {
			setTimeout(() => {
				return new InterfaceComponent(
					"heart_inner",
					{
						origin: [
							-172 + (i % 10) * 16,
							-(WINDOW_HEIGHT / 2) + 68 + Math.floor(i / 10) * 20,
						],
						size: [16, 14],
						uv: [53, 1],
					},
					"gui/icons.png",
				);
			});
		}),
	],
	hunger_bar = [
		Array.from({length: 10}, (_, i) => {
			return new InterfaceComponent(
				"hunger_outline",
				{
					origin: [
						173 - (i % 10) * 16,
						-(WINDOW_HEIGHT / 2) + 68 + (Math.floor(i / 10) * 20),
					],
					size: [18, 18],
					uv: [16, 27],
				},
				"gui/icons.png",
			);
		}),
		Array.from({length: 10}, (_, i) => {
			setTimeout(() => {
				return new InterfaceComponent(
					"hunger_inner",
					{
						origin: [
							174 - (i % 10) * 16,
							-(WINDOW_HEIGHT / 2) + 69 + (Math.floor(i / 10) * 20),
						],
						size: [16, 16],
						uv: [53, 27],
					},
					"gui/icons.png",
				);
			});
		}),
	];

ctx.canvas.width = WINDOW_WIDTH;
ctx.canvas.height = WINDOW_HEIGHT;
ctx.imageSmoothingEnabled = false;

/*const
	inventory_bar_selector_slots = [-159, -119, -79, -39, 1, 41, 81, 121, 161],
	inventory_bar_selector = new UIElement([12, 12], [inventory_bar_selector_slots[0], -(WINDOW_HEIGHT / 2 - (11 / 2) * 4 + 1), 1], ["gui/widgets.png", [0, 44]], "inventory_bar_selector"),
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

document.querySelector("#inventory_container").style.display = "none";

let selected_slot = 0,
	inventoryOpened = false;*/