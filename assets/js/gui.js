function InterfaceComponent(id, obj, tsrc) {
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
	this.visible = true;
	this.texture = tsrc;
	this.setPosition = (pos) => {
		this.origin.x = pos[0];
		this.origin.y = pos[1];
	};
	this.setVisibility = visibility => {
		this.visible = visibility;
	};

	return this;
};

UILayer.components
	.add(
		new InterfaceComponent(
			"crosshair",
			{
				origin: [0, 0],
				size: [18, 18],
				uv: [3, 3],
			},
			"gui/icons.png",
		),
	)
	.add(
		new InterfaceComponent(
			"hotbar",
			{
				origin: [0, -(WINDOW_HEIGHT / 2) + 21],
				size: [364, 44],
				uv: [0, 0],
			},
			"gui/widgets.png",
		),
	);
UILayer.update();

SelectorLayer.components
	.add(
		new InterfaceComponent(
			"hotbar_selector",
			{
				origin: [-160, -(WINDOW_HEIGHT / 2) + 21],
				size: [48, 48],
				uv: [0, 22],
			},
			"gui/widgets.png",
		),
	);
SelectorLayer.update();

ExperienceLayer.components.add(
	new InterfaceComponent(
		"experience_bar",
		{
			origin: [0, -(WINDOW_HEIGHT / 2) + 52],
			size: [364, 10],
			uv: [0, 64],
		},
		"gui/icons.png",
	),
);
ExperienceLayer.update();

for (let i = 0; i < 10; i++) {
	HealthLayer.components
		.add(
			new InterfaceComponent(
				"heart_outline",
				{
					origin: [-173 + (i % 10) * 16, -(WINDOW_HEIGHT / 2) + 68 + Math.floor(i / 10) * 20],
					size: [18, 18],
					uv: [16, 0],
				},
				"gui/icons.png",
			),
		)
		/*.add(
			new InterfaceComponent(
				"heart_inner",
				{
					origin: [-172 + (i % 10) * 16, -(WINDOW_HEIGHT / 2) + 68 + Math.floor(i / 10) * 20],
					size: [16, 14],
					uv: [53, 1],
				},
				"gui/icons.png",
			),
		)*/;
}
HealthLayer.update();

for (let i = 0; i < 10; i++) {
	HungerLayer.components
		.add(
			new InterfaceComponent(
				"hunger_outline",
				{
					origin: [173 - (i % 10) * 16, -(WINDOW_HEIGHT / 2) + 68 + Math.floor(i / 10) * 20],
					size: [18, 18],
					uv: [16, 27],
				},
				"gui/icons.png",
			),
		)
		/*.add(
			new InterfaceComponent(
				"hunger_inner",
				{
					origin: [174 - (i % 10) * 16, -(WINDOW_HEIGHT / 2) + 69 + Math.floor(i / 10) * 20],
					size: [16, 16],
					uv: [53, 27],
				},
				"gui/icons.png",
			),
		)*/;
}
HungerLayer.update();

UIContainerLayer.setVisibility(false);
UIContainerLayer.components.add(
	new InterfaceComponent(
		"inventory_container",
		{
			origin: [0, 0],
			size: [352, 332],
			uv: [0, 0],
		},
		"gui/container/inventory.png",
	),
);
UIContainerLayer.update();

/*const slots = {
	armor: Array.from({length: 4}, (_, i) => {
		return new Slot({
			x: -144,
			y: 135 - i * 36,
		});
	}),
	inventory: Array.from({length: 27}, (_, i) => {
		return new Slot({
			x: -144 + (i % 9) * 36,
			y: -17 - Math.floor(i / 9) * 36,
		});
	}),
	hotbar: Array.from({length: 9}, (_, i) => {
		return new Slot({
			x: -144 + i * 36,
			y: -133,
		});
	}),
};

// Add items to slots

let iron_chestplate = new Item("Iron Chestplate", "item/iron_chestplate.png");
slots.armor[1].assign(iron_chestplate);

let stone_sword = new Item("Stone Sword", "item/stone_sword.png");
slots.hotbar[0].assign(stone_sword);

let bread = new Item("Bread", "item/bread.png");
bread.setStack(17);
slots.hotbar[8].assign(bread);*/

let selected_slot = 0,
	inventoryOpened = false;