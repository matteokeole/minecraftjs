/**
 * Construct a slot which can contain an item
 * @param {object} slot - Slot informations, such as id and position
 */
function Slot(slot) {
	this.w = 8 * UI_SIZE;
	this.h = 8 * UI_SIZE;
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
		this.element.append(item.element);
	};
	this.empty = () => {
		this.element.firstChild.remove();
		this.item = null;
	};

	document.body.append(this.element);

	return this;
}

function Item(name, tsrc, uv) {
	this.w = 8 * UI_SIZE;
	this.h = 8 * UI_SIZE;
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
		background-color: transparent;
		background-image: url(assets/textures/${tsrc});
		background-size: 100%;
		image-rendering: pixelated;
	`;
	let stackElement = document.createElement("span");
	stackElement.className = "stack-count";
	// if (this.stack > 1) stackElement.textContent = this.stack;
	this.element.append(stackElement);
	this.setStack = count => {
		// Can't get more than 64 items in one slot

		this.stack = count;
		// if (this.stack > 1) stackElement.textContent = this.stack;
		return this;
	};

	this.element.setAttribute("title", this.name);

	return this;
}