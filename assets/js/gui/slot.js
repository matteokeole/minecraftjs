/**
 * Construct a slot which can contain an item
 * @param {object} slot - Slot informations, such as id and position
 */
function Slot(slot) {
	this.id = lastSlotId;
	lastSlotId++;
	this.type = slot.type;
	this.w = 9 * SETTINGS.ui_size;
	this.h = 9 * SETTINGS.ui_size;
	this.x = slot.x;
	this.y = slot.y;
	this.item = null;
	this.element = document.createElement("div");
	this.element.dataset.id = this.id;
	this.element.className = `slot ${lastSlotId}`;
	this.element.style.cssText = `
		width: ${this.w}px;
		height: ${this.h}px;
		position: absolute;
		left: ${WINDOW_WIDTH / 2 - (this.w / 2) + this.x}px;
		top: ${WINDOW_HEIGHT / 2 - (this.h / 2) - this.y}px;
	`;
	this.assign = item => {
		this.item = item;
		this.element.appendChild(this.item.element);
		this.item.element.style.position = "static";
	};
	this.empty = () => {
		this.element.replaceChildren();
		this.item = null;
	};

	return this;
}

Slot.getSlotAt = e => {
	if (e.target.className.includes("slot")) {
		// Assuming slots have unique ID
		return ContainerLayer.components.list[0].slots.filter(s => s.id === e.target.dataset.id)[0];
	}
	/*for (let section of Object.values(SLOTS)) {
		for (let slot of section) {
			if (
				slot.x - slot.w / 2 <= (x - WINDOW_WIDTH / 2).toFixed(0) &&
				slot.x + slot.w / 2 > (x - WINDOW_WIDTH / 2).toFixed(0) &&
				slot.y - slot.h / 2 <= -(y - WINDOW_HEIGHT / 2).toFixed(0) &&
				slot.y + slot.h / 2 >= -(y - WINDOW_HEIGHT / 2).toFixed(0)
			) return slot;
		}
	}*/
};

let lastSlotId = 0;