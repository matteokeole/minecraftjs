const
	UIElement = function([w, h], [x, y, z = 0], [tsrc, uv], id) {
		// Width & height in px
		this.width = w;
		this.height = h;
		this.x = x;
		this.y = y;
		this.z = z;
		this.texture = tsrc;
		this.uv = uv;
		this.id = id;
		this.texture = {
			src: tsrc,
			w: 0,
			h: 0,
		};
		this.element = document.createElement("div");
		this.element.style.cssText = `
			width: ${w}px;
			height: ${h}px;
			margin: auto;
			left: ${window.innerWidth / 2 - (w / 2) + x}px;
			top: ${window.innerHeight / 2 - (h / 2) + y}px;
			position: absolute;
			background-color: transparent;
			background-image: url(${tsrc});
			background-position: ${-uv[0]}px ${-uv[1]}px;
			background-repeat: no-repeat;
			image-rendering: pixelated;
			z-index: ${this.z};
			transform: scale(4);
		`;

		this.updateX = function(x) {
			this.element.style.left = `${window.innerWidth / 2 - (w / 2) + x}px`;
		};

		document.body.append(this.element);

		// Load interface texture
		const TEXTURE = new Image();
		TEXTURE.addEventListener("load", () => {
			this.texture.w = TEXTURE.width;
			this.texture.h = TEXTURE.height;
			this.element.style.backgroundSize = `${this.texture.w / 2}px`;
		});
		TEXTURE.src = this.texture.src;
	},
	crosshair = new UIElement([4.5, 4.5], [0, 0], ["assets/textures/gui/widgets.png", [121.5, 1.5]], "crosshair"),
	inventory_bar = new UIElement([91, 11], [0, (window.innerHeight / 2 - (11 / 2) * 4)], ["assets/textures/gui/widgets.png", [0, 0]], "inventory_bar"),
	inventory_bar_selector_slots = [
		-159,
		-119,
		-79,
		-39,
		1,
		41,
		81,
		121,
		161,
	],
	hearth_slots = [
		-173,
		-157,
		-141,
		-125,
		-109,
		-93,
		-77,
		-61,
		-45,
		-29,
	],
	hunger_slots = [
		29,
		45,
		61,
		77,
		93,
		109,
		125,
		141,
		157,
		173,
	],
	inventory_bar_selector = new UIElement([12, 12], [inventory_bar_selector_slots[0], (window.innerHeight / 2 - (11 / 2) * 4 + 1), 1], ["assets/textures/gui/widgets.png", [0, 11]], "inventory_bar_selector"),
	experience_bar = new UIElement([91, 2.5], [0, (window.innerHeight / 2 - (11 / 2) * 4 - 31)],  ["assets/textures/gui/icons.png", [0, 32]], "experience_bar");
	health_bar = [],
	hunger_bar = [];

let selected_slot = 0;



for (let i = 0; i < 10; i++) {
	let heart_outline = new UIElement([4.5, 4.5], [hearth_slots[i], (window.innerHeight / 2 - (11 / 2) * 4 - 48)], ["assets/textures/gui/icons.png", [8, 0]], `heart-${i}`),
		heart_inner = new UIElement([4, 3.5], [hearth_slots[i] + 1, (window.innerHeight / 2 - (11 / 2) * 4 - 48)], ["assets/textures/gui/icons.png", [26.5, .5]], `heart-${i}`);
	health_bar.push([heart_outline, heart_inner]);

	let hunger_outline = new UIElement([4.5, 4.5], [hunger_slots[i], (window.innerHeight / 2 - (11 / 2) * 4 - 48)], ["assets/textures/gui/icons.png", [8, 13.5]], `hunger-${i}`);
		hunger_inner = new UIElement([3.5, 3.5], [hunger_slots[i], (window.innerHeight / 2 - (11 / 2) * 4 - 48)], ["assets/textures/gui/icons.png", [26.5, 14]], `hunger-${i}`);
	health_bar.push([hunger_outline]);
}