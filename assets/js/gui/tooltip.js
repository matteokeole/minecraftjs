const Tooltip = {
	element: document.createElement("div"),
	value: "",
	x: 0,
	y: 0,
	visible: true,
	print: function(value) {
		this.value = value;
		this.element.innerHTML = this.value;
	},
	move: function(x, y) {
		this.x = x;
		this.y = y;
		this.element.style.left = `${this.x + 18}px`;
		this.element.style.top = `${this.y - 30}px`;
	},
	toggle: function(state = !this.visible) {
		this.visible = state;
		this.element.style.visibility = this.visible ? "visible" : "hidden";
	},
};

// Tooltip DOM
Tooltip.element.className = "tooltip";
document.body.appendChild(Tooltip.element);

Tooltip.print("Bread");
Tooltip.move(0, 0);

addEventListener("mousemove", e => {
	const slot = Slot.getSlotAt(e.clientX, e.clientY);
	if (slot && slot.item && !flowing_item) {
		Tooltip.print(slot.item.name);
		Tooltip.move(e.clientX, e.clientY);
		Tooltip.toggle(1);
	} else Tooltip.toggle(0);
});

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