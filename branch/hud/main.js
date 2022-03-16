import {Font, Keybinds} from "./variables.js";
import {Layer} from "./layer.js";
import {Component} from "./component.js";
import {Slot} from "./slot.js";
import {Item} from "./item.js";

export const Fetch = {
	items: undefined,
};

(() => {
	// Check for Fetch API browser compatibility
	if (!("fetch" in window)) {
		console.error("This browser doesn't support Fetch API.");
		return;
	}

	Promise
		.all([
			fetch("../../assets/items.json").then(response => response.json()),
		])
		.then(response => {
			Fetch.items = response[0];

			const
				Player = {
					maxHealth: 20,
					health: 20,
					maxHunger: 20,
					hunger: 20,
				},
				InfoLayer		= new Layer({name: "info"}),
				CrosshairLayer	= new Layer({name: "crosshair"}),
				HUD				= new Layer({name: "hud"});

			InfoLayer
				.add(
					new Component({
						type: "text",
						name: "tip-console",
						origin: [
							() => 0,
							() => window.innerHeight / 2 - 10 * HUD.scale,
						],
						texture: "font/ascii.png",
						text: "HUD Demo",
						text_color: "#FF5555",
					}),
				)
				.update();

			CrosshairLayer.canvas.style.mixBlendMode = "difference";
			CrosshairLayer
				.add(
					new Component({
						name: "crosshair",
						origin: [
							() => 0,
							() => 0,
						],
						size: [
							() => 9 * HUD.scale,
							() => 9 * HUD.scale,
						],
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
							() => -window.innerHeight / 2 + 11 * HUD.scale,
						],
						size: [
							() => 182 * HUD.scale,
							() => 22 * HUD.scale,
						],
						texture: "gui/widgets.png",
						uv: [0, 0],
						slots: Array.from({length: 9}, (_, i) => {
							return new Slot({
								origin: [
									() => -80 * HUD.scale + 20 * i * HUD.scale,
									() => (-window.innerHeight / 2) + 3 * HUD.scale,
								],
							});
						}),
					}),
				)
				.add(
					new Component({
						name: "selector",
						origin: [
							() => -80 * HUD.scale + 20 * HUD.scale * selected_slot,
							() => (-window.innerHeight / 2) + 11 * HUD.scale,
						],
						size: [
							() => 24 * HUD.scale,
							() => 24 * HUD.scale,
						],
						texture: "gui/widgets.png",
						uv: [0, 22],
					}),
				)
				.add(
					new Component({
						name: "experience_bar",
						origin: [
							() => 0,
							() => (-window.innerHeight / 2) + 26.5 * HUD.scale,
						],
						size: [
							() => 182 * HUD.scale,
							() => 5 * HUD.scale,
						],
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
							() => (-window.innerHeight / 2) + 108,
						],
						texture: "font/ascii.png",
						text: "",
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
								() => -window.innerHeight / 2 + Math.floor(i / 10) * 20 + 35 * HUD.scale,
							],
							size: [
								() => 9 * HUD.scale,
								() => 9 * HUD.scale,
							],
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
									() => -(window.innerHeight / 2) + Math.floor(j / 10) * 20 + 35 * HUD.scale,
								],
								size: [
									() => 8 * HUD.scale,
									() => 7 * HUD.scale,
								],
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
									() => -window.innerHeight / 2 + Math.floor(j / 10) * 20 + 35 * HUD.scale,
								],
								size: [
									() => 8 * HUD.scale,
									() => 7 * HUD.scale,
								],
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
								() => -window.innerHeight / 2 + Math.floor(i / 10) * 20 + 35 * HUD.scale,
							],
							size: [
								() => 9 * HUD.scale,
								() => 9 * HUD.scale,
							],
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
									() => -window.innerHeight / 2 + Math.floor(j / 10) * 20 + 35 * HUD.scale,
								],
								size: [
									() => 8 * HUD.scale,
									() => 9 * HUD.scale,
								],
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
									() => -window.innerHeight / 2 + Math.floor(j / 10) * 20 + 35 * HUD.scale,
								],
								size: [
									() => 8 * HUD.scale,
									() => 9 * HUD.scale,
								],
								texture: "gui/icons.png",
								uv: [53, 27],
							}),
						);
				}
			}

			HUD.components.hotbar
				.slots[0].assign(new Item(Fetch.items.filter(i => i.id === 272)[0]))
				.slots[1].assign(new Item(Fetch.items.filter(i => i.id === 261)[0]))
				.slots[2].assign(new Item(Fetch.items.filter(i => i.id === 274)[0]))
				.slots[6].assign(new Item(Fetch.items.filter(i => i.id === 368)[0]))
				.slots[7].assign(new Item(Fetch.items.filter(i => i.id === 326)[0]))
				.slots[8].assign(new Item(Fetch.items.filter(i => i.id === 297)[0]));

			HUD.update();

			let
				selected_slot	= 0,
				canSwitchSlot	= true,
				isSlotKey		= false,
				c				= HUD.components;

			addEventListener("keydown", e => {
				if (!/^(Control(Left|Right)|F\d+)$/.test(e.code)) e.preventDefault();
				if (canSwitchSlot) {
					isSlotKey = false;
					canSwitchSlot = false;

					if (e.code === Keybinds.toggle_hud) {
						HUD.toggle();
						CrosshairLayer.toggle();
					}

					for (let i in Keybinds.hotbar_slots) {
						if (e.code === Keybinds.hotbar_slots[i]) isSlotKey = true;
					}

					if (isSlotKey) {
						// Clear the previous selected slot
						HUD.erase(c.selector);

						// Re-draw the part of the hotbar where the selector was
						HUD.ctx.drawImage(
							HUD.loadedTextures[HUD.components.hotbar.texture],
							c.hotbar.uv.x + (selected_slot * 20) - 1,
							c.hotbar.uv.y,
							c.selector.size.x() / HUD.scale,
							c.hotbar.size.y() / HUD.scale,
							(HUD.canvas.width / 2) - (c.selector.size.x() / 2) + c.selector.origin.x(),
							(HUD.canvas.height / 2) - (c.selector.size.y() / 2) - c.selector.origin.y() + HUD.scale,
							c.selector.size.x(),
							c.hotbar.size.y(),
						);

						// Update selected slot number
						selected_slot = Keybinds.hotbar_slots.indexOf(e.code);

						c.tooltip.text = c.hotbar.slots[selected_slot].item ? c.hotbar.slots[selected_slot].item.displayName : "";
						// Performance issue
						// HUD.erase(c.tooltip);
						// HUD.draw(c.tooltip);

						// Re-draw the selector on the new hotbar slot
						HUD.draw(c.selector);
					}
				}
			});

			addEventListener("keyup", () => canSwitchSlot = true);

			addEventListener("wheel", e => {
				// Clear the previous selected slot
				HUD.erase(c.selector);

				// Re-draw the part of the hotbar where the selector was
				HUD.ctx.drawImage(
					HUD.loadedTextures[HUD.components.hotbar.texture],
					c.hotbar.uv.x + (selected_slot * 20) - 1,
					c.hotbar.uv.y,
					c.selector.size.x() / HUD.scale,
					c.hotbar.size.y() / HUD.scale,
					(HUD.canvas.width / 2) - (c.selector.size.x() / 2) + c.selector.origin.x(),
					(HUD.canvas.height / 2) - (c.selector.size.y() / 2) - c.selector.origin.y() + HUD.scale,
					c.selector.size.x(),
					c.hotbar.size.y(),
				);

				// Increment/decrement selector based on wheel direction
				selected_slot = e.deltaY > 0 ? (selected_slot < 8 ? ++selected_slot : 0) : (selected_slot > 0 ? --selected_slot : 8);

				c.tooltip.text = c.hotbar.slots[selected_slot].item ? c.hotbar.slots[selected_slot].item.displayName : "";
				// Performance issue
				// HUD.erase(c.tooltip);
				// HUD.draw(c.tooltip);

				// Re-draw the selector on the new hotbar slot
				HUD.draw(c.selector);
			});
		})
		.catch(error => console.error(error));
})();