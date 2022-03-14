const
	items = [
		{
			id: 376,
			displayName: "Fermented Spider Eye",
			name: "fermented_spider_eye",
			stackSize: 64,
		},
	],
	Player = {
		maxHealth: 20,
		health: 17,
		maxHunger: 20,
		hunger: 19,
	},
	CrosshairLayer = new Layer({name: "crosshair"}),
	HUD = new Layer({name: "hud"}),
	/**
	 * Convert an hexadecimal color to its RGB variant.
	 * @param	{string}	hex	Hexadecimal code, hash optional.	"#000000"
	 */
	hexToRGB = (hex = "#000000") => {
		const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		return result ? {
			r: parseInt(result[1], 16),
			g: parseInt(result[2], 16),
			b: parseInt(result[3], 16),
		} : null;
	};

CrosshairLayer.canvas.style.mixBlendMode = "difference";
CrosshairLayer
	.add(
		new Component({
			name: "crosshair",
			origin: [
				() => 0,
				() => 0,
			],
			size: [18, 18],
			texture: "gui/icons.png",
			uv: [3, 3],
		}),
	)
	.update();

HUD
	.add(
		new Component({
			type: "container",
			name: "hotbar",
			origin: [
				() => 0,
				() => -window.innerHeight / 2,
			],
			size: [364, 44],
			texture: "gui/widgets.png",
			uv: [0, 0],
			slots: Array.from({length: 9}, (_, i) => {
				return new Slot({
					origin: [
						() => -80 * HUD.scale + 20 * i * HUD.scale,
						() => -window.innerHeight / 2 + 3 * HUD.scale,
					],
				});
			}),
		}),
	)
	.add(
		new Component({
			name: "selector",
			origin: [
				() => -80 * HUD.scale,
				() => -window.innerHeight / 2 - HUD.scale,
			],
			size: [48, 48],
			texture: "gui/widgets.png",
			uv: [0, 22],
		}),
	)
	.add(
		new Component({
			name: "experience_bar",
			origin: [
				() => 0,
				() => -window.innerHeight / 2 + 24 * HUD.scale,
			],
			size: [364, 10],
			texture: "gui/icons.png",
			uv: [0, 64],
		}),
	)
	.add(
		new Component({
			type: "text",
			name: "tooltip",
			origin: [
				() => 0,
				() => -(window.innerHeight / 2) + 108,
			],
			texture: "font/ascii.png",
			text: "Spruce Planks",
			text_color: "#FFFFFF",
		}),
	);

// Heart outlines
for (let i = 0; i < Player.maxHealth / 2; i++) {
	HUD.add(
			new Component({
				name: `heart_outline_${i}`,
				origin: [
					() => -86.5 * HUD.scale + (i % 10) * 8 * HUD.scale,
					() => -window.innerHeight / 2 + Math.floor(i / 10) * 20 + 30 * HUD.scale,
				],
				size: [18, 18],
				texture: "gui/icons.png",
				uv: [16, 0],
			}),
		);
}

// Heart inners
let j = 0;
for (let i = 0; i < Player.health; i++) {
	// Add half-heart if health value is odd
	if (Player.health % 2 !== 0 && i + 1 === Player.health) {
		j = i / 2;
		HUD.add(
				new Component({
					name: `heart_inner_${j}`,
					origin: [
						() => -86 * HUD.scale + (i / 2 % 10) * 8 * HUD.scale,
						() => -(window.innerHeight / 2) + Math.floor(j / 10) * 20 + 31 * HUD.scale,
					],
					size: [16, 14],
					texture: "gui/icons.png",
					uv: [62, 1],
				}),
			);
		break;
	}
	else if (i % 2 === 0) {
		j = i / 2;
		HUD.add(
				new Component({
					name: `heart_inner_${j}`,
					origin: [
						() => -86 * HUD.scale + (i / 2 % 10) * 8 * HUD.scale,
						() => -window.innerHeight / 2 + Math.floor(j / 10) * 20 + 31 * HUD.scale,
					],
					size: [16, 14],
					texture: "gui/icons.png",
					uv: [53, 1],
				}),
			);
	}
}

// Hunger outlines
for (let i = 0; i < Player.maxHunger / 2; i++) {
	HUD.add(
			new Component({
				name: `hunger_outline_${i}`,
				origin: [
					() => 86.5 * HUD.scale - (i % 10) * 8 * HUD.scale,
					() => -window.innerHeight / 2 + Math.floor(i / 10) * 20 + 30 * HUD.scale,
				],
				size: [18, 18],
				texture: "gui/icons.png",
				uv: [16, 27],
			}),
		);
}

// Hunger inners
j = 0;
for (let i = 0; i < Player.hunger; i++) {
	// Add half-hunger if hunger value is odd
	if (Player.hunger % 2 !== 0 && i + 1 === Player.hunger) {
		j = i / 2;
		HUD.add(
				new Component({
					name: `hunger_inner_${j}`,
					origin: [
						() => 87 * HUD.scale - (i / 2 % 10) * 8 * HUD.scale,
						() => -window.innerHeight / 2 + Math.floor(j / 10) * 20 + 31 * HUD.scale,
					],
					size: [16, 16],
					texture: "gui/icons.png",
					uv: [62, 27],
				}),
			);
	}
	else if (i % 2 === 0) {
		j = i / 2;
		HUD.add(
				new Component({
					name: `hunger_inner_${j}`,
					origin: [
						() => 87 * HUD.scale - (i / 2 % 10) * 8 * HUD.scale,
						() => -window.innerHeight / 2 + Math.floor(j / 10) * 20 + 31 * HUD.scale,
					],
					size: [16, 16],
					texture: "gui/icons.png",
					uv: [53, 27],
				}),
			);
	}
}

HUD.components.hotbar.slots[5].assign(new Item({id: 376}));

HUD.update();

let
	selected_slot	= 0,
	canSwitchSlot	= true,
	isSlotKey		= false;
	c				= HUD.components;

addEventListener("keydown", e => {
	if (!/^(ControlLeft|ControlRight|F\d+)$/.test(e.code)) e.preventDefault();
	if (canSwitchSlot) {
		isSlotKey = false;
		canSwitchSlot = false;
		let prev_slot = selected_slot;

		if (e.code === Keybinds.toggle_hud) {
			HUD.toggle();
			CrosshairLayer.toggle();
		}

		for (let i in Keybinds.hotbar_slots) {
			if (e.code === Keybinds.hotbar_slots[i]) {
				isSlotKey = true;
				// Get the key digit
				selected_slot = e.code.charAt(5) - 1;
			}
		}

		if (isSlotKey) {
			// Clear the previous selected slot
			HUD.ctx.clearRect(
				HUD.canvas.width / 2 - (c.selector.size.x * HUD.scale / 4) + c.selector.origin.x() + prev_slot * (c.selector.size.x * HUD.scale / 2 - HUD.scale * 4),
				HUD.canvas.height / 2 - (c.selector.size.y * HUD.scale / 2) - c.selector.origin.y(),
				c.selector.size.x * HUD.scale / 2,
				c.selector.size.y * HUD.scale / 2,
			);

			// Re-draw the hotbar part where the selector was
			HUD.ctx.drawImage(
				HUD.loadedTextures[HUD.components.hotbar.texture],
				c.hotbar.uv.x - (prev_slot * c.selector.origin.x() / HUD.scale / 4) - 1,
				c.hotbar.uv.y,
				c.hotbar.size.x / 16 + 1.25,
				c.hotbar.size.y / 2,
				HUD.canvas.width / 2 - (c.selector.size.x * HUD.scale / 4) + c.selector.origin.x() + prev_slot * (c.selector.size.x * HUD.scale / 2 - HUD.scale * 4),
				HUD.canvas.height / 2 - (c.selector.size.y * HUD.scale / 2) - c.selector.origin.y() + HUD.scale,
				c.selector.size.x * HUD.scale / 2,
				c.hotbar.size.y * HUD.scale / 2,
			);

			// Re-draw the selector on the new selected slot
			HUD.ctx.drawImage(
				HUD.loadedTextures[HUD.components.selector.texture],
				c.selector.uv.x,
				c.selector.uv.y,
				c.selector.size.x / 2,
				c.selector.size.y / 2,
				HUD.canvas.width / 2 - (c.selector.size.x * HUD.scale / 4) + c.selector.origin.x() + selected_slot * (c.selector.size.x * HUD.scale / 2 - HUD.scale * 4),
				HUD.canvas.height / 2 - (c.selector.size.y * HUD.scale / 2) - c.selector.origin.y(),
				c.selector.size.x * HUD.scale / 2,
				c.selector.size.y * HUD.scale / 2,
			);
		}
	}
});

addEventListener("keyup", () => canSwitchSlot = true);

addEventListener("wheel", e => {
	// Clear the previous selected slot
	HUD.ctx.clearRect(
		HUD.canvas.width / 2 - (c.selector.size.x * HUD.scale / 4) + c.selector.origin.x() + selected_slot * (c.selector.size.x * HUD.scale / 2 - HUD.scale * 4),
		HUD.canvas.height / 2 - (c.selector.size.y * HUD.scale / 2) - c.selector.origin.y(),
		c.selector.size.x * HUD.scale / 2,
		c.selector.size.y * HUD.scale / 2,
	);

	// Re-draw the hotbar part where the selector was
	HUD.ctx.drawImage(
		HUD.loadedTextures[HUD.components.hotbar.texture],
		c.hotbar.uv.x - (selected_slot * c.selector.origin.x() / HUD.scale / 4) - 1,
		c.hotbar.uv.y,
		c.hotbar.size.x / 16 + 1.25,
		c.hotbar.size.y / 2,
		HUD.canvas.width / 2 - (c.selector.size.x * HUD.scale / 4) + c.selector.origin.x() + selected_slot * (c.selector.size.x * HUD.scale / 2 - HUD.scale * 4),
		HUD.canvas.height / 2 - (c.selector.size.y * HUD.scale / 2) - c.selector.origin.y() + HUD.scale,
		c.selector.size.x * HUD.scale / 2,
		c.hotbar.size.y * HUD.scale / 2,
	);

	// Increment/decrement selector based on wheel direction
	selected_slot = e.deltaY > 0 ? (selected_slot < 8 ? ++selected_slot : 0) : (selected_slot > 0 ? --selected_slot : 8);

	// Re-draw the selector on the new selected slot
	HUD.ctx.drawImage(
		HUD.loadedTextures[HUD.components.selector.texture],
		c.selector.uv.x,
		c.selector.uv.y,
		c.selector.size.x / 2,
		c.selector.size.y / 2,
		HUD.canvas.width / 2 - (c.selector.size.x * HUD.scale / 4) + c.selector.origin.x() + selected_slot * (c.selector.size.x * HUD.scale / 2 - HUD.scale * 4),
		HUD.canvas.height / 2 - (c.selector.size.y * HUD.scale / 2) - c.selector.origin.y(),
		c.selector.size.x * HUD.scale / 2,
		c.selector.size.y * HUD.scale / 2,
	);
});