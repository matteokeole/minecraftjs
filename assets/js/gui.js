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

		// Load interface texture
		const TEXTURE = new Image();
		TEXTURE.addEventListener("load", () => {
			this.texture.w = TEXTURE.width;
			this.texture.h = TEXTURE.height;

			// Create UI element
			const element = document.createElement("div");
			element.style.cssText = `
				width: ${w}px;
				height: ${h}px;
				margin: auto;
				left: ${window.innerWidth / 2 - (w / 2) + x}px;
				top: ${window.innerHeight / 2 - (h / 2) + y}px;
				position: absolute;
				background-image: url(${tsrc});
				background-position: ${-uv[0]}px ${-uv[1]}px;
				background-repeat: no-repeat;
				background-size: ${this.texture.w / 2}px;
				image-rendering: pixelated;
				z-index: ${this.z};
				transform: scale(4);
			`;

			document.body.append(element);
		});
		TEXTURE.src = this.texture.src;
	},
	crosshair = new UIElement([4.5, 4.5], [0, 0], ["assets/textures/gui/widgets.png", [121.5, 1.5], "crosshair"]),
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
		141,
	],
	inventory_bar_selector = new UIElement([12, 12], [inventory_bar_selector_slots[0], (window.innerHeight / 2 - (11 / 2) * 4 + 1), 1], ["assets/textures/gui/widgets.png", [0, 11]], "inventory_bar_selector");

inventory_bar_selector.setPosition = 1;