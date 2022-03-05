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
	this.toggle = state => {
		this.visible = state;
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

ContainerLayer.components
	.add(
		new InterfaceComponent(
			"inventory_container",
			{
				origin: [0, 0],
				size: [352, 332],
				uv: [0, 0],
			},
			"gui/container/inventory.png",
		),
	)
	.add(
		new InterfaceComponent(
			"placeholder_helmet",
			{
				origin: [-144, 134],
				size: [32, 32],
				uv: [0, 0],
			},
			"item/empty_armor_slot_helmet.png",
		),
	)
	.add(
		new InterfaceComponent(
			"placeholder_chesplate",
			{
				origin: [-144, 98],
				size: [32, 32],
				uv: [0, 0],
			},
			"item/empty_armor_slot_chestplate.png",
		),
	)
	.add(
		new InterfaceComponent(
			"placeholder_leggings",
			{
				origin: [-144, 62],
				size: [32, 32],
				uv: [0, 0],
			},
			"item/empty_armor_slot_leggings.png",
		),
	)
	.add(
		new InterfaceComponent(
			"placeholder_boots",
			{
				origin: [-144, 26],
				size: [32, 32],
				uv: [0, 0],
			},
			"item/empty_armor_slot_boots.png",
		),
	)
	.add(
		new InterfaceComponent(
			"placeholder_shield",
			{
				origin: [-6, 26],
				size: [32, 32],
				uv: [0, 0],
			},
			"item/empty_armor_slot_shield.png",
		),
	);
ContainerLayer.update();