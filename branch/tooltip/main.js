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
									() => -76 * ContainerLayer.scale,
								],
							});
						}),
					}),
				);

			const
				fermented_spider_eye = new Item(866),
				netherite_sword = new Item(724);
			fermented_spider_eye.type = "item";
			netherite_sword.type = "tool";

			ContainerLayer.components.inventory
				.slots[0].assign(fermented_spider_eye)
				.slots[1].assign(netherite_sword);

			ContainerLayer.setScale(2);
			ContainerLayer.update();

			TooltipLayer.toggle(0);
			TooltipLayer
				.add(
					new Component({
						type: "text",
						name: "line_1",
						origin: [
							() => 0,
							() => 0,
						],
						texture: "font/ascii.png",
						text: "",
						text_color: Fetch.font.colors.white,
						text_shadow: true,
					}),
				)
				.add(
					new Component({
						type: "text",
						name: "line_2",
						origin: [
							() => 0,
							() => 22,
						],
						texture: "font/ascii.png",
						text: "",
						text_color: Fetch.font.colors.dark_gray,
						text_shadow: true,
					}),
				)
				.add(
					new Component({
						type: "text",
						name: "line_3",
						origin: [
							() => 0,
							() => 42,
						],
						texture: "font/ascii.png",
						text: "",
						text_color: Fetch.font.colors.dark_gray,
						text_shadow: true,
					}),
				)
				.add(
					new Component({
						type: "text",
						name: "line_4",
						origin: [
							() => 0,
							() => 62,
						],
						texture: "font/ascii.png",
						text: "",
						text_color: Fetch.font.colors.dark_gray,
						text_shadow: true,
					}),
				)
				.add(
					new Component({
						type: "text",
						name: "line_5",
						origin: [
							() => 0,
							() => 82,
						],
						texture: "font/ascii.png",
						text: "",
						text_color: Fetch.font.colors.white,
						text_shadow: true,
					}),
				)
				.add(
					new Component({
						type: "text",
						name: "line_6",
						origin: [
							() => 0,
							() => 102,
						],
						texture: "font/ascii.png",
						text: "",
						text_color: Fetch.font.colors.dark_gray,
						text_shadow: true,
					}),
				)
				.add(
					new Component({
						type: "text",
						name: "line_7",
						origin: [
							() => 0,
							() => 122,
						],
						texture: "font/ascii.png",
						text: "",
						text_color: Fetch.font.colors.dark_gray,
						text_shadow: true,
					}),
				)
				.add(
					new Component({
						type: "text",
						name: "line_8",
						origin: [
							() => 0,
							() => 142,
						],
						texture: "font/ascii.png",
						text: "",
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

				let current_slot = Slot.getSlotAt(ContainerLayer.components.inventory, e.clientX, e.clientY);

				if (current_slot && current_slot.item) {
					t.style.visibility = "visible";
					TooltipLayer.toggle(1);

					let displayedLines = 1;

					for (let comp of Object.values(c)) {
						comp.text = "";
						TooltipLayer.redraw(comp);
					}

					c.line_1.text = current_slot.item.displayName;
					TooltipLayer.redraw(c.line_1);

					switch (current_slot.item.type) {
						case "item":
							displayedLines += 2;

							c.line_3.text_color = Fetch.font.colors.dark_gray;
							c.line_2.text = "minecraft:" + current_slot.item.name;
							TooltipLayer.redraw(c.line_2);

							c.line_3.text_color = Fetch.font.colors.dark_gray;
							c.line_3.text = "No NBT tag";
							TooltipLayer.redraw(c.line_3);

							break;

						case "tool":
							displayedLines += 7;

							c.line_3.text_color = Fetch.font.colors.dark_gray;
							c.line_2.text = "";
							TooltipLayer.redraw(c.line_2);

							c.line_3.text_color = Fetch.font.colors.gray;
							c.line_3.text = "When in main hand:";
							TooltipLayer.redraw(c.line_3);

							c.line_4.text_color = Fetch.font.colors.dark_green;
							c.line_4.text = " 7 Attack Damage";
							TooltipLayer.redraw(c.line_4);

							c.line_5.text_color = Fetch.font.colors.dark_green;
							c.line_5.text = " 1.6 Attack Speed";
							TooltipLayer.redraw(c.line_5);

							c.line_6.text_color = Fetch.font.colors.dark_gray;
							c.line_6.text = "minecraft:" + current_slot.item.name;
							TooltipLayer.redraw(c.line_6);

							c.line_7.text_color = Fetch.font.colors.white;
							c.line_7.text = "Durability: 1560 / 1561";
							TooltipLayer.redraw(c.line_7);

							c.line_8.text_color = Fetch.font.colors.dark_gray;
							c.line_8.text = "NBT: 1 tag(s)";
							TooltipLayer.redraw(c.line_8);

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