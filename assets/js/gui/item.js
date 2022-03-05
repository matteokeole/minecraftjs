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
SLOTS.hotbar[0].assign(stone_sword);

let bread = new Item("Bread", "item/bread.png");
bread.setStack(17);
SLOTS.inventory[4].assign(bread);