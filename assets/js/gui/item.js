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

// Add items to slots

let iron_chestplate = new Item("Iron Chestplate", "item/iron_chestplate.png");
SLOTS.armor[1].assign(iron_chestplate);

let stone_sword = new Item("Stone Sword", "item/stone_sword.png");
SLOTS.inventory_hotbar[0].assign(stone_sword);

let bread = new Item("Bread", "item/bread.png");
bread.setStack(17);
SLOTS.inventory[4].assign(bread);



let flowing_item = undefined;
addEventListener("mousedown", e => {
	const slot = Slot.getSlotAt(e.clientX, e.clientY);
	if (!flowing_item) {
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
		// Release item, drag & drop end
		if (slot) {
			if (slot.item) {
				// Swap items
				let flowing_item_memory = slot.item;
				slot.empty();
				slot.assign(flowing_item);
				flowing_item = flowing_item_memory;
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
				Tooltip.toggle();
			}
		}
	}
});

function moveItemOnCursor(e) {
	flowing_item.move(e.clientX - flowing_item.w / 2, e.clientY - flowing_item.h / 2);
};