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
	this.assign = item => {
		this.item = item;
		this.element.append(this.item.element);
		this.item.element.style.position = "static";
	};
	this.empty = () => {
		this.element.firstChild.remove();
		this.item = null;
	};

	document.querySelector(".slots").appendChild(this.element);

	return this;
}

Slot.getSlotAt = (x, y) => {
	for (let section of Object.values(SLOTS)) {
		for (let slot of section) {
			if (
				slot.x - slot.w / 2 <= (x - WINDOW_WIDTH / 2).toFixed(0) &&
				slot.x + slot.w / 2 > (x - WINDOW_WIDTH / 2).toFixed(0) &&
				slot.y - slot.h / 2 <= -(y - WINDOW_HEIGHT / 2).toFixed(0) &&
				slot.y + slot.h / 2 >= -(y - WINDOW_HEIGHT / 2).toFixed(0)
			) return slot;
		}
	}
};

const SLOTS = {
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