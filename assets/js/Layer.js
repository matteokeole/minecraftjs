import {WINDOW, LOADED_TEXTURES, Font, LayerFragment, update_scale, scale, visibilities} from "./main.js";

/**
 * Construct a new interface layer with an associated canvas.
 *
 * Param	Type		Name=Default					Description
 * @param	{object}	[layer={}]						Layer data object
 * @param	{string}	layer.name						Name (used as canvas ID)
 * @param	{object}	[layer.parent=LayerFragment]	DOM parent
 * @param	{boolean}	[layer.visible=1]				Visibility state
 * @param	{object}	[layer.components={}]			Layer component list
 */
export function Layer(layer = {}) {
	// Name
	this.name = layer.name;

	// DOM parent
	this.parent = layer.parent ?? LayerFragment;

	// Size
	this.w = WINDOW.WIDTH;
	this.h = WINDOW.HEIGHT;

	// Visibility
	this.visible = layer.visible ?? 1;

	// Canvas
	this.canvas = document.createElement("canvas");

	// Canvas context
	this.ctx = this.canvas.getContext("2d");

	// Component list
	this.components = layer.components ?? {};

	/**
	 * Set the layer size.
	 * NOTE: The new size will be applied on the layer components after a canvas update.
	 * @param	{number}	[w=WINDOW.WIDTH]	Width value
	 * @param	{number}	[h=WINDOW.HEIGHT]	Height value
	 */
	this.resize = (w = WINDOW.WIDTH, h = WINDOW.HEIGHT) => {
		this.w = w;
		this.h = h;

		return this;
	};

	/**
	 * Toggle layer visibility using a canvas CSS attribute.
	 * If omitted, the state will be the opposite of the current visibility.
 	 * @param	{boolean}	[v=!this.visible]	New visibility value
	 */
	this.toggle = (state = !this.visible) => {
		this.visible = Number(state);
		this.canvas.style.visibility = visibilities[this.visible];

		return this;
	};

	/**
	 * Calculate the scaled offset/size and absolute position for the specified component.
 	 * @param	{object}	c	Component
	 */
	this.compute = c => {
		// Get scaled offset
		let o = [
			c.offset[0] * scale,
			c.offset[1] * scale,
		];

		// Text components don't have size values by default, we need to calculate them using line size
		if (c.type === "text") {
			// Explode the text in lines
			c.lines = c.text.split("\n");

			let widths = [];

			// Calculate line widths
			for (let l of c.lines) {
				let w = 0;
				for (let c of l) {
					w += (Font.size[c] ?? 5) + 1;
				}
				widths.push(w);
			}

			// The width is the max line width found for this component
			c.size[0] = Math.max(...widths) + 2;

			// Multiply line number to get the height
			c.size[1] = 9 * c.lines.length;
		}

		// Scale the size
		c.w = c.size[0] * scale;
		c.h = c.size[1] * scale;

		// Calculate absolute X position
		switch (c.origin[0]) {
			case "left":
				c.x = o[0];
				break;

			case "right":
				c.x = this.w - c.w - o[0];
				break;

			case "center":
				c.x = this.w / 2 - c.w / 2 + o[0];
				break;
		}

		// Calculate absolute Y position
		switch (c.origin[1]) {
			case "top":
				c.y = o[1];
				break;

			case "bottom":
				c.y = this.h - c.h - o[1];
				break;

			case "center":
				c.y = this.h / 2 - c.h / 2 + o[1];
				break;
		}

		return this;
	};

	this.redraw = (...cs) => {
		let redraw_single = true;
		if (!cs.length) {
			redraw_single = false;
			cs = Object.values(this.components).map(c => c.name);
			this.erase();
		}
		for (let c of cs) {
			c = this.components[c];
			redraw_single && this.erase(c);
			this.compute(c).draw(c);
		}
		return this;
	};

	this.draw = c => {
		if (c.type === "text") {
			let x, y = c.y + scale;
			for (let l of c.lines) {
				x = c.x + scale;
				for (let ch of l) {
					let i = Font.chars.indexOf(ch),
						u = i % 16 * 8,
						v = 8 * (Math.floor(i / 16) + 2);
					if (c.text_shadow) {
						this.ctx.globalAlpha = .245;
						this.ctx.drawImage(
							LOADED_TEXTURES[c.texture],
							u, v,
							6, 8,
							x + scale, y + scale,
							6 * scale, 8 * scale,
						);
					}
					this.ctx.globalAlpha = 1;
					this.ctx.drawImage(
						LOADED_TEXTURES[c.texture],
						u, v,
						6, 8,
						x, y,
						6 * scale, 8 * scale,
					);
					x += ((Font.size[ch] ?? 5) + 1) * scale;
				}
				y += 9 * scale;
			}
			this.ctx.globalCompositeOperation = "source-atop";
			this.ctx.fillStyle = c.color;
			this.ctx.fillRect(
				c.x, c.y,
				c.w, c.h + (c.text_shadow ? scale : 0),
			);
			if (c.text_background) {
				this.ctx.globalCompositeOperation = "destination-over";
				this.ctx.fillStyle = c.text_background;
				this.ctx.globalAlpha = c.text_background_alpha;
				this.ctx.fillRect(
					c.x, c.y,
					c.w, c.h + (c.text_shadow ? scale : 0),
				);
			}
			this.ctx.globalCompositeOperation = "source-over";
		} else {
			if (c.texture) {
				this.ctx.drawImage(
					LOADED_TEXTURES[c.texture],
					c.uv[0], c.uv[1],
					c.size[0], c.size[1],
					c.x, c.y,
					c.w, c.h,
				);
			}
			if (c.type === "container") {
				for (let s of c.slots) {
					c.compute_slot(s);
					s.hovered = false;
					s.render_item();
				}
			}
		}
		return this;
	};

	this.erase = c => {
		if (c) {
			this.ctx.clearRect(
				c.x, c.y,
				c.w, c.h,
			);
		} else {
			this.ctx.clearRect(
				0, 0,
				WINDOW.MAX_WIDTH, WINDOW.MAX_HEIGHT,
			);
		}
		return this;
	};

	// Initialize layer components
	Object.entries(this.components).forEach(c => {
		c[1].name = c[0];
		c[1].layer = this;
	});

	// Set canvas class
	this.canvas.className = `layer ${this.name}`;

	// Make the canvas take the full screen size
	this.canvas.width = WINDOW.MAX_WIDTH;
	this.canvas.height = WINDOW.MAX_HEIGHT;

	// Remove canvas blur effect
	this.ctx.imageSmoothingEnabled = false;

	// Append the canvas to the layer parent
	this.parent.appendChild(this.canvas);

	// Set default canvas visibility
	this.toggle(this.visible);
}