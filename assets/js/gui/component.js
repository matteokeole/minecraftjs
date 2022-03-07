/**
 * Construct a new layer component
 * @param {object} component - Component data, such as:
 * @param {string} type - Component type
 * @param {string} id - Component ID
 * @param {array} origin - Component position, [0] for X and [1] for Y
 * @param {array} size - Component size, [0] for width and [1] for height
 * @param {string} texture - Component texture source (starts at assets/textures/)
 * @param {array} uv - Component texture offset, [0] for X and [1] for Y
 * @param {boolean} visible - Component visibility attribute, which the canvas uses to draw it or not
 * @param {array} slots - Component slots to be displayed (only for container types)
 */
function InterfaceComponent(component) {
	this.type = component.type;
	this.id = component.id;
	this.origin = {
		x: component.origin[0],
		y: component.origin[1],
	};
	this.size = {
		x: component.size[0],
		y: component.size[1],
	};
	this.texture = component.texture;
	this.uv = {
		x: component.uv[0],
		y: component.uv[1],
	};
	this.visible = component.visible ? component.visible : true;
	this.slots = this.type === "container" ? component.slots : undefined;

	this.setPosition = pos => {
		this.origin.x = pos[0];
		this.origin.y = pos[1];
	};
	this.toggle = (state = !this.visible) => {
		this.visible = state;
	};

	return this;
};

UILayer.components
	.add(
		new InterfaceComponent({
			id: "crosshair",
			origin: [0, 0],
			size: [18, 18],
			texture: "gui/icons.png",
			uv: [3, 3],
		}),
	)
	.add(
		new InterfaceComponent({
			id: "hotbar",
			origin: [0, -(WINDOW_HEIGHT / 2) + 21],
			size: [364, 44],
			texture: "gui/widgets.png",
			uv: [0, 0],
		}),
	);
UILayer.update();

SelectorLayer.components.add(
	new InterfaceComponent({
		id: "hotbar_selector",
		origin: [-160, -(WINDOW_HEIGHT / 2) + 21],
		size: [48, 48],
		texture: "gui/widgets.png",
		uv: [0, 22],
	}),
);
SelectorLayer.update();

ExperienceLayer.components.add(
	new InterfaceComponent({
		id: "experience_bar",
		origin: [0, -(WINDOW_HEIGHT / 2) + 52],
		size: [364, 10],
		texture: "gui/icons.png",
		uv: [0, 64],
	}),
);
ExperienceLayer.update();

for (let i = 0; i < 10; i++) {
	HealthLayer.components
		.add(
			new InterfaceComponent({
				id: "heart_outline",
				origin: [-173 + (i % 10) * 16, -(WINDOW_HEIGHT / 2) + 68 + Math.floor(i / 10) * 20],
				size: [18, 18],
				texture: "gui/icons.png",
				uv: [16, 0],
			}),
		)
		.add(
			new InterfaceComponent({
				id: "heart_inner",
				origin: [-172 + (i % 10) * 16, -(WINDOW_HEIGHT / 2) + 68 + Math.floor(i / 10) * 20],
				size: [16, 14],
				texture: "gui/icons.png",
				uv: [53, 1],
			}),
		);
}
HealthLayer.update();

for (let i = 0; i < 10; i++) {
	HungerLayer.components
		.add(
			new InterfaceComponent({
				id: "hunger_outline",
				origin: [173 - (i % 10) * 16, -(WINDOW_HEIGHT / 2) + 68 + Math.floor(i / 10) * 20],
				size: [18, 18],
				texture: "gui/icons.png",
				uv: [16, 27],
			}),
		)
		.add(
			new InterfaceComponent({
				id: "hunger_inner",
				origin: [174 - (i % 10) * 16, -(WINDOW_HEIGHT / 2) + 69 + Math.floor(i / 10) * 20],
				size: [16, 16],
				texture: "gui/icons.png",
				uv: [53, 27],
			}),
		);
}
HungerLayer.update();

ContainerLayer.components
	.add(
		new InterfaceComponent({
			type: "container",
			id: "inventory",
			origin: [0, 0],
			size: [352, 332],
			texture: "gui/container/inventory.png",
			uv: [0, 0],
		}),
	)
	.add(
		new InterfaceComponent({
			id: "placeholder_helmet",
			origin: [-144, 134],
			size: [32, 32],
			texture: "item/empty_armor_slot_helmet.png",
			uv: [0, 0],
		}),
	)
	.add(
		new InterfaceComponent({
			id: "placeholder_chesplate",
			origin: [-144, 98],
			size: [32, 32],
			texture: "item/empty_armor_slot_chestplate.png",
			uv: [0, 0],
		}),
	)
	.add(
		new InterfaceComponent({
			id: "placeholder_leggings",
			origin: [-144, 62],
			size: [32, 32],
			texture: "item/empty_armor_slot_leggings.png",
			uv: [0, 0],
		}),
	)
	.add(
		new InterfaceComponent({
			id: "placeholder_boots",
			origin: [-144, 26],
			size: [32, 32],
			texture: "item/empty_armor_slot_boots.png",
			uv: [0, 0],
		}),
	)
	.add(
		new InterfaceComponent({
			id: "placeholder_shield",
			origin: [-6, 26],
			size: [32, 32],
			texture: "item/empty_armor_slot_shield.png",
			uv: [0, 0],
		}),
	);