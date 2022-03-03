const UI_SIZE = 4;

/**
 * Construct a slot which can contain an item
 * @param {object} slot - Slot informations, such as id and position
 */
function Slot(slot) {
	this.id = slot.id;
	this.w = 8 * 4;
	this.h = 8 * 4;
	this.x = slot.x;
	this.y = slot.y;
	this.element = document.createElement("div");
	this.element.className = "slot";
	this.element.style.cssText = `
		width: ${this.w}px;
		height: ${this.h}px;
		position: absolute;
		left: ${window.innerWidth / 2 - (this.w / 2) + this.x}px;
		top: ${window.innerHeight / 2 - (this.h / 2) - this.y}px;
	`;
	this.assign = item => {
		this.element.append(item.element);
	};
	this.empty = () => {
		while (this.element.firstChild) {
			this.element.firstChild.remove();
		}
	};

	document.body.append(this.element);

	return this;
}

function Item(name, tsrc, uv) {
	this.w = 8 * 4;
	this.h = 8 * 4;
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
	if (this.stack > 1) stackElement.textContent = this.stack;
	this.element.append(stackElement);
	this.setStack = count => {
		if (count > 64) {
			console.error("You can't set more than 64 objects in a stack.");
			return;
		}
		this.stack = count;
		if (this.stack > 1) stackElement.textContent = this.stack;
		console.info(`Updated ${name} stack count to ${this.stack}!`);
		return this;
	};

	this.element.setAttribute("title", this.name);

	return this;
}