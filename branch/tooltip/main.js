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
							() => 10,
							() => 10,
						],
						texture: "font/ascii.png",
						text: "Detailed Tooltip Demo",
						text_color: Fetch.font.colors.gray,
					}),
				)
				.add(
					new Component({
						type: "container",
						name: "inventory",
						origin: [
							() => ContainerLayer.canvas.width / 2,
							() => ContainerLayer.canvas.height / 2,
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
									() => -18 * ContainerLayer.scale,
								],
							});
						}),
					}),
				);

			const
				diamond_sword = new Item(719),
				diamond_chestplate = new Item(751),
				bread = new Item(737);

			diamond_sword.type = "tool";
			diamond_chestplate.type = "armor";
			bread.type = "item";

			ContainerLayer.components.inventory
				.slots[0].assign(diamond_sword)
				.slots[4].assign(diamond_chestplate)
				.slots[8].assign(bread);

			ContainerLayer.setScale(2);
			ContainerLayer.update();

			TooltipLayer.toggle(0);
			TooltipLayer.setScale(2);
			for (let i = 0; i < 14; i++) {
				TooltipLayer.add(
					new Component({
						type: "text",
						name: `line_${i + 1}`,
						origin: [
							() => 0,
							() => (i ? 2 : 0) + 20 * i,
						],
						texture: "font/ascii.png",
						text: "dfv",
						text_color: Fetch.font.colors.white,
						text_shadow: true,
					})
				);
			}
			TooltipLayer.update();

			const t = document.querySelector(".tooltip");
			t.style.visibility = "hidden";
			t.append(TooltipLayer.canvas);

			let c = TooltipLayer.components;

			addEventListener("mousemove", e => {
				t.style.left = `${e.clientX + 18}px`;
				t.style.top = `${e.clientY - 30}px`;

				let current_slot = Slot.getSlotAt(ContainerLayer.components.inventory, e.clientX, e.clientY);

				if (current_slot && current_slot.item) {
					t.style.visibility = "visible";
					TooltipLayer.toggle(1);

					let displayedLines = 0;

					for (let comp of Object.values(c)) {
						comp.text = "";
						TooltipLayer.redraw(comp);
					}

					c.line_1.text = current_slot.item.displayName;
					TooltipLayer.redraw(c.line_1);

					switch (current_slot.item.type) {
						case "item":
							displayedLines = 2;

							c.line_2.text_color = Fetch.font.colors.dark_gray;
							c.line_2.text = "minecraft:" + current_slot.item.name;
							TooltipLayer.redraw(c.line_2);

							break;

						case "tool":
							displayedLines = 7;

							c.line_2.text_color = Fetch.font.colors.dark_gray;
							c.line_2.text = "";
							TooltipLayer.redraw(c.line_2);

							c.line_3.text_color = Fetch.font.colors.gray;
							c.line_3.text = "When in Main Hand:";
							TooltipLayer.redraw(c.line_3);

							c.line_4.text_color = Fetch.font.colors.dark_green;
							c.line_4.text = " 7 Attack Damage";
							TooltipLayer.redraw(c.line_4);

							c.line_5.text_color = Fetch.font.colors.dark_green;
							c.line_5.text = " 1.6 Attack Speed";
							TooltipLayer.redraw(c.line_5);

							c.line_6.text_color = Fetch.font.colors.white;
							c.line_6.text = "Durability: 1560 / 1561";
							TooltipLayer.redraw(c.line_6);

							c.line_7.text_color = Fetch.font.colors.dark_gray;
							c.line_7.text = "minecraft:" + current_slot.item.name;
							TooltipLayer.redraw(c.line_7);

							break;

						case "armor":
							displayedLines = 7;

							c.line_2.text_color = Fetch.font.colors.dark_gray;
							c.line_2.text = "";
							TooltipLayer.redraw(c.line_2);

							c.line_3.text_color = Fetch.font.colors.gray;
							c.line_3.text = "When on Body:";
							TooltipLayer.redraw(c.line_3);

							c.line_4.text_color = Fetch.font.colors.blue;
							c.line_4.text = "+8 Armor";
							TooltipLayer.redraw(c.line_4);

							c.line_5.text_color = Fetch.font.colors.blue;
							c.line_5.text = "+8 Armor Thoughness";
							TooltipLayer.redraw(c.line_5);

							c.line_6.text_color = Fetch.font.colors.white;
							c.line_6.text = "Durability: 1560 / 1561";
							TooltipLayer.redraw(c.line_6);

							c.line_7.text_color = Fetch.font.colors.dark_gray;
							c.line_7.text = "minecraft:" + current_slot.item.name;
							TooltipLayer.redraw(c.line_7);

							break;
					}

					// Scale tooltip to canvas
					t.style.width = Math.max(
						c.line_1.size.x(),
						c.line_2.size.x(),
						c.line_3.size.x(),
						c.line_4.size.x(),
						c.line_5.size.x(),
						c.line_6.size.x(),
						c.line_7.size.x(),
						c.line_8.size.x(),
						c.line_9.size.x(),
						c.line_10.size.x(),
						c.line_11.size.x(),
						c.line_12.size.x(),
						c.line_13.size.x(),
						c.line_14.size.x(),
					) + 2 + "px";
					t.style.height = `${20 * displayedLines + 1}px`;
				} else {
					t.style.visibility = "hidden";
					TooltipLayer.toggle(0);
				}
			});
		})
		.catch(error => console.error(error));
})();