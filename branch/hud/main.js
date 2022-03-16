import {Keybinds, Player} from "./variables.js";
import {Layer} from "./layer.js";
import {Component} from "./component.js";
import {Slot} from "./slot.js";
import {Item} from "./item.js";
import {renderHealth, renderHunger} from "./functions.js";

export const Fetch = {
	font: undefined,
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
			fetch("../../assets/font.json").then(response => response.json()),
			fetch("../../assets/items.json").then(response => response.json()),
		])
		.then(response => {
			Fetch.font = response[0];
			Fetch.items = response[1];

			const
				InfoLayer		= new Layer({name: "info"}),
				CrosshairLayer	= new Layer({name: "crosshair"}),
				HUDLayer		= new Layer({name: "hud"}),
				ContainerLayer	= new Layer({
					name: "container",
					visible: 0,
				});

			// Event listeners
			addEventListener("contextmenu", e => e.preventDefault());

			InfoLayer
				.add(
					new Component({
						type: "text",
						name: "tip-console",
						origin: [
							() => 0,
							() => window.innerHeight / 2 - 2 * HUDLayer.scale,
						],
						texture: "font/ascii.png",
						text: "HUDLayer Demo",
						text_color: Fetch.font.colors.yellow,
						text_shadow: true,
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
							() => 9 * CrosshairLayer.scale,
							() => 9 * CrosshairLayer.scale,
						],
						texture: "gui/icons.png",
						uv: [3, 3],
					}),
				)
				.update();

			HUDLayer
				.add(
					new Component({
						type: "container",
						name: "hotbar",
						origin: [
							() => 0,
							() => -window.innerHeight / 2 + 11 * HUDLayer.scale,
						],
						size: [
							() => 182 * HUDLayer.scale,
							() => 22 * HUDLayer.scale,
						],
						texture: "gui/widgets.png",
						uv: [0, 0],
						slots: Array.from({length: 9}, (_, i) => {
							return new Slot({
								origin: [
									() => -80 * HUDLayer.scale + 20 * i * HUDLayer.scale,
									() => (-window.innerHeight / 2) + 3 * HUDLayer.scale,
								],
							});
						}),
					}),
				)
				.add(
					new Component({
						name: "selector",
						origin: [
							() => -80 * HUDLayer.scale + 20 * HUDLayer.scale * selected_slot,
							() => (-window.innerHeight / 2) + 11 * HUDLayer.scale,
						],
						size: [
							() => 24 * HUDLayer.scale,
							() => 24 * HUDLayer.scale,
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
							() => (-window.innerHeight / 2) + 26.5 * HUDLayer.scale,
						],
						size: [
							() => 182 * HUDLayer.scale,
							() => 5 * HUDLayer.scale,
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

			renderHealth(HUDLayer);
			renderHunger(HUDLayer);

			HUDLayer.components.hotbar
				.slots[0].assign(new Item(272))
				.slots[1].assign(new Item(261))
				.slots[2].assign(new Item(274))
				.slots[6].assign(new Item(368))
				.slots[7].assign(new Item(326))
				.slots[8].assign(new Item(297));

			HUDLayer.update();

			let
				selected_slot	= 0,
				canSwitchSlot	= true,
				isSlotKey		= false,
				c				= HUDLayer.components;

			addEventListener("keydown", e => {
				if (!/^(Control(Left|Right)|F\d+)$/.test(e.code)) e.preventDefault();
				if (canSwitchSlot) {
					isSlotKey = false;
					canSwitchSlot = false;

					if (e.code === Keybinds.toggle_hud) {
						HUDLayer.toggle();
						CrosshairLayer.toggle();
					}

					for (let i in Keybinds.hotbar_slots) {
						if (e.code === Keybinds.hotbar_slots[i]) isSlotKey = true;
					}

					if (isSlotKey) {
						// Clear the previous selected slot
						HUDLayer.erase(c.selector);

						// Re-draw the part of the hotbar where the selector was
						HUDLayer.ctx.drawImage(
							HUDLayer.loadedTextures[HUDLayer.components.hotbar.texture],
							c.hotbar.uv.x + (selected_slot * 20) - 1,
							c.hotbar.uv.y,
							c.selector.size.x() / HUDLayer.scale,
							c.hotbar.size.y() / HUDLayer.scale,
							(HUDLayer.canvas.width / 2) - (c.selector.size.x() / 2) + c.selector.origin.x(),
							(HUDLayer.canvas.height / 2) - (c.selector.size.y() / 2) - c.selector.origin.y() + HUDLayer.scale,
							c.selector.size.x(),
							c.hotbar.size.y(),
						);

						// Update selected slot number
						selected_slot = Keybinds.hotbar_slots.indexOf(e.code);

						c.tooltip.text = c.hotbar.slots[selected_slot].item ? c.hotbar.slots[selected_slot].item.displayName : "";
						HUDLayer.erase(c.tooltip);
						// Performance issue
						// HUDLayer.draw(c.tooltip);

						// Re-draw the selector on the new hotbar slot
						HUDLayer.draw(c.selector);
					}
				}
			});

			addEventListener("keyup", () => canSwitchSlot = true);

			addEventListener("wheel", e => {
				// Clear the previous selected slot
				HUDLayer.erase(c.selector);

				// Re-draw the part of the hotbar where the selector was
				HUDLayer.ctx.drawImage(
					HUDLayer.loadedTextures[HUDLayer.components.hotbar.texture],
					c.hotbar.uv.x + (selected_slot * 20) - 1,
					c.hotbar.uv.y,
					c.selector.size.x() / HUDLayer.scale,
					c.hotbar.size.y() / HUDLayer.scale,
					(HUDLayer.canvas.width / 2) - (c.selector.size.x() / 2) + c.selector.origin.x(),
					(HUDLayer.canvas.height / 2) - (c.selector.size.y() / 2) - c.selector.origin.y() + HUDLayer.scale,
					c.selector.size.x(),
					c.hotbar.size.y(),
				);

				// Increment/decrement selector based on wheel direction
				selected_slot = e.deltaY > 0 ? (selected_slot < 8 ? ++selected_slot : 0) : (selected_slot > 0 ? --selected_slot : 8);

				c.tooltip.text = c.hotbar.slots[selected_slot].item ? c.hotbar.slots[selected_slot].item.displayName : "";
				HUDLayer.erase(c.tooltip);
				// Performance issue
				// HUDLayer.draw(c.tooltip);

				// Re-draw the selector on the new hotbar slot
				HUDLayer.draw(c.selector);
			});
		})
		.catch(error => console.error(error));
})();