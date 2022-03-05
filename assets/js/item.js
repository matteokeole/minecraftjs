/**
 * Construct a slot which can contain an item
 * @param {object} slot - Slot informations, such as id and position
 */
function Slot(slot) {
	this.w = 9 * SETTINGS.ui_size;
	this.h = 9 * SETTINGS.ui_size;
	this.x = slot.x;
	this.y = slot.y;
	this.item = null;
	this.element = document.createElement("div");
	this.element.className = "slot";
	this.element.style.cssText = `
		width: ${this.w}px;
		height: ${this.h}px;
		position: absolute;
		left: ${WINDOW_WIDTH / 2 - (this.w / 2) + this.x}px;
		top: ${WINDOW_HEIGHT / 2 - (this.h / 2) - this.y}px;
	`;
	/*this.element.addEventListener("mousedown", () => {
		if (this.item) {
			const item = this.item;
			// this.empty();
			item.element.style.position = "absolute";
			addEventListener("mousemove", e => {
				item.setPosition([
					e.clientX - WINDOW_WIDTH / 2,
					e.clientY - WINDOW_HEIGHT / 2,
				]);
			});
		}
	});*/
	this.assign = item => {
		this.item = item;
		this.element.append(item.element);
	};
	this.empty = () => {
		this.element.firstChild.remove();
		this.item = null;
	};

	document.querySelector(".slots").appendChild(this.element);

	return this;
}

function Item(name, tsrc, uv) {
	this.w = 8 * SETTINGS.ui_size;
	this.h = 8 * SETTINGS.ui_size;
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
	this.setPosition = pos => {
		this.element.style.left = `${pos[0]}px`;
		this.element.style.top = `${pos[1]}px`;
	};

	this.element.setAttribute("title", this.name);

	return this;
}



const slots = {
	armor: Array.from({length: 4}, (_, i) => {
		return new Slot({
			x: -144,
			y: 135 - i * 36,
		});
	}),
	inventory: Array.from({length: 27}, (_, i) => {
		return new Slot({
			x: -144 + (i % 9) * 36,
			y: -17 - Math.floor(i / 9) * 36,
		});
	}),
	hotbar: Array.from({length: 9}, (_, i) => {
		return new Slot({
			x: -144 + i * 36,
			y: -133,
		});
	}),
};

// Add items to slots

let iron_chestplate = new Item("Iron Chestplate", "item/iron_chestplate.png");
slots.armor[1].assign(iron_chestplate);

let stone_sword = new Item("Stone Sword", "item/stone_sword.png");
slots.inventory[4].assign(stone_sword);

let bread = new Item("Bread", "item/bread.png");
bread.setStack(17);
slots.hotbar[8].assign(bread);

let selected_slot = 0;