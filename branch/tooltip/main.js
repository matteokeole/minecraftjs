import {Keybinds, Player} from "./variables.js";
import {Layer} from "./layer.js";
import {Component} from "./component.js";
import {Slot} from "./slot.js";
import {Item} from "./item.js";
import {draw, erase} from "./drawer.js";

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
				ContainerLayer	= new Layer({name: "container"}),
				TooltipLayer	= new Layer({name: "tooltip"});

			// Event listeners
			addEventListener("contextmenu", e => e.preventDefault());

			ContainerLayer
				.add(
					new Component({
						type: "text",
						name: "title",
						origin: [
							() => 0,
							() => (window.innerHeight / 2) - 6 * ContainerLayer.scale,
						],
						texture: "font/ascii.png",
						text: "Detailed Tooltip Demo",
						text_color: Fetch.font.colors.yellow,
						text_shadow: true,
					}),
				)
				.add(
					new Component({
						type: "container",
						name: "inventory",
						origin: [
							() => 0,
							() => 0,
						],
						size: [
							() => 176 * ContainerLayer.scale,
							() => 166 * ContainerLayer.scale,
						],
						texture: "gui/container/inventory.png",
						uv: [0, 0],
						slots: Array.from({length: 9}, (_, i) => {
							return new Slot({
								type: "hotbar",
								origin: [
									() => -72 * ContainerLayer.scale + i * 18 * ContainerLayer.scale,
									() => -76 * ContainerLayer.scale,
								],
							});
						}),
					}),
				);

			ContainerLayer.components.inventory
				.slots[0].assign(new Item(272))
				.slots[1].assign(new Item(261))
				.slots[2].assign(new Item(274))
				.slots[6].assign(new Item(368))
				.slots[7].assign(new Item(326))
				.slots[8].assign(new Item(297));

			ContainerLayer.setScale(2);
			ContainerLayer.update();

			TooltipLayer.toggle(0);
			TooltipLayer
				.add(
					new Component({
						type: "text",
						name: "display_name",
						origin: [
							() => 0,
							() => 18,
						],
						texture: "font/ascii.png",
						text: "display",
						text_color: Fetch.font.colors.white,
						text_shadow: true,
					}),
				)
				.add(
					new Component({
						type: "text",
						name: "name",
						origin: [
							() => 0,
							() => -2,
						],
						texture: "font/ascii.png",
						text: "name",
						text_color: Fetch.font.colors.dark_gray,
						text_shadow: true,
					}),
				)
				.update();

			const t = document.querySelector(".tooltip");
			t.style.visibility = "hidden";
			t.append(TooltipLayer.canvas);

			let c = TooltipLayer.components;

			addEventListener("mousemove", e => {
				t.style.left = `${e.clientX + 18}px`;
				t.style.top = `${e.clientY - 30}px`;
				let current_slot = Slot.getSlotAt(ContainerLayer.components.inventory, e.clientX, e.clientY)
				if (current_slot && current_slot.item) {
					t.style.visibility = "visible";
					TooltipLayer.toggle(1);
					c.display_name.text = current_slot.item.displayName;
					c.name.text = `minecraft:${current_slot.item.name}`;
					TooltipLayer.erase(c.display_name);
					TooltipLayer.draw(c.display_name);
					TooltipLayer.erase(c.name);
					TooltipLayer.draw(c.name);
					t.style.width = `${Math.max(c.display_name.size.x(), c.name.size.x())}px`;
					t.style.height = `${c.display_name.size.y() * 2 + 8}px`;
				} else {
					t.style.visibility = "hidden";
					TooltipLayer.toggle(0);
				}
			});
		})
		.catch(error => console.error(error));
})();