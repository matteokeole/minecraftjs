function Item(name, tsrc, uv) {
	this.w = 8 * SETTINGS.ui_size;
	this.h = 8 * SETTINGS.ui_size;
	this.x = 0;
	this.y = 0;
	this.name = name;
	this.stack = 1;
	this.element = document.createElement("div");
	this.element.className = "item";
	this.element.style.cssText = `
		display: flex;
		justify-content: flex-end;
		align-items: end;
		width: ${this.w}px;
		height: ${this.h}px;
		margin: 2px;
		background-image: url(assets/textures/${tsrc});
		background-size: 100%;
		image-rendering: pixelated;
	`;
	this.setStack = count => {
		// Can't get more than 64 items in one slot
		if (count <= 64) this.stack = count;
		return this;
	};
	this.move = (x, y) => {
		this.x = x;
		this.y = y;
		this.element.style.left = `${this.x}px`;
		this.element.style.top = `${this.y}px`;
	};

	return this;
}

let flowing_item = undefined;
addEventListener("mousedown", e => {
	const slot = Slot.getSlotAt(e);
	if (!flowing_item) {
		// No pre-selected item
		if (slot && slot.item) {
			// Take item, drag & drop start
			Tooltip.toggle();
			flowing_item = slot.item;
			slot.empty();
			flowing_item.element.style.position = "absolute";
			flowing_item.element.style.pointerEvents = "none";
			flowing_item.element.style.zIndex = 2;
			document.body.appendChild(flowing_item.element);

			flowing_item.move(e.clientX - flowing_item.w / 2, e.clientY - flowing_item.h / 2);
			addEventListener("mousemove", moveItemOnCursor);
		}
	} else {
		// Preselected item
		if (slot) {
			// Release item, drag & drop end
			if (slot.item) {
				// Swap items
				flowing_item = slot.swap(flowing_item);
				flowing_item.element.style.position = "absolute";
				flowing_item.element.style.pointerEvents = "none";
				flowing_item.element.style.zIndex = 2;
				document.body.appendChild(flowing_item.element);

				flowing_item.move(e.clientX - flowing_item.w / 2, e.clientY - flowing_item.h / 2);
				addEventListener("mousemove", moveItemOnCursor);
			} else {
				// Release item into this slot
				flowing_item.element.style.pointerEvents = "auto";
				flowing_item.element.remove();
				slot.assign(flowing_item);
				flowing_item = undefined;
				removeEventListener("mousemove", moveItemOnCursor);

				// Show tooltip after drag & drop end
				Tooltip.print(slot.item.name);
				Tooltip.move(e.clientX, e.clientY);
				Tooltip.toggle();
			}
		}
	}
});

function moveItemOnCursor(e) {
	flowing_item.move(
		e.clientX - flowing_item.w / 2,
		e.clientY - flowing_item.h / 2,
	);
};



// Test itemss
const
	netherite_helmet = new Item("Netherite Helmet", "item/netherite_helmet.png"),
	elytra = new Item("Elytra", "item/elytra.png"),
	netherite_leggings = new Item("Netherite Leggings", "item/netherite_leggings.png"),
	netherite_boots = new Item("Netherite Boots", "item/netherite_boots.png"),
	netherite_sword = new Item("Netherite Sword", "item/netherite_sword.png"),
	bow = new Item("Bow", "item/bow.png"),
	netherite_pickaxe = new Item("Netherite Pickaxe", "item/netherite_pickaxe.png"),
	water_bucket = new Item("Water Bucket", "item/water_bucket.png"),
	bread = new Item("Bread", "item/bread.png");

ContainerLayer.components.inventory.slots.armor[0].assign(netherite_helmet);
ContainerLayer.components.inventory.slots.armor[1].assign(elytra);
ContainerLayer.components.inventory.slots.armor[2].assign(netherite_leggings);
ContainerLayer.components.inventory.slots.armor[3].assign(netherite_boots);
ContainerLayer.components.inventory.slots.hotbar[0].assign(netherite_sword);
ContainerLayer.components.inventory.slots.hotbar[1].assign(bow);
ContainerLayer.components.inventory.slots.hotbar[2].assign(netherite_pickaxe);
ContainerLayer.components.inventory.slots.hotbar[7].assign(water_bucket);
ContainerLayer.components.inventory.slots.hotbar[8].assign(bread);
ContainerLayer.update();