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
				TooltipLayer	= new Layer({
					name: "tooltip",
					visible: 0,
				});

			// Event listeners
			addEventListener("contextmenu", e => e.preventDefault());

			ContainerLayer
				.add(
					new Component({
						type: "text",
						name: "tip-console",
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
							() => 352,
							() => 332,
						],
						texture: "gui/container/inventory.png",
						uv: [0, 0],
						slots: Array.from({length: 9}, (_, i) => {
							return new Slot({
								origin: [
									() => -144 + i * 36,
									() => -150,
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

			ContainerLayer.update();

			// TooltipLayer.canvas.style.width = "100px";
			// TooltipLayer.canvas.style.height = "30px";
			TooltipLayer.canvas.className = "tooltip";

			TooltipLayer
				.add(
					new Component({
						type: "text",
						name: "item_name",
						origin: [
							() => (-window.innerWidth / 2),
							() => (window.innerHeight / 2),
						],
						texture: "font/ascii.png",
						text: "Item Name",
						text_color: Fetch.font.colors.white,
						text_shadow: true,
					}),
				)
				.update();

			// let c = ContainerLayer.components;

			addEventListener("mousemove", e => {
				TooltipLayer.canvas.style.left = `${e.clientX}px`;
				TooltipLayer.canvas.style.top = `${e.clientY}px`;

				let current_slot = Slot.getSlotAt(ContainerLayer.components.inventory, e.clientX, e.clientY)
				if (current_slot && current_slot.item) {
					TooltipLayer.toggle(1);
					TooltipLayer.components.item_name.text = current_slot.item.displayName;
					TooltipLayer.erase(TooltipLayer.components.item_name);
					TooltipLayer.draw(TooltipLayer.components.item_name);
				} else TooltipLayer.toggle(0);
			});
		})
		.catch(error => console.error(error));
})();