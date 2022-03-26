import {WINDOW, TEXTURES, Font, Visibilities, LayerFragment, scale} from "./main.js";

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
		this.canvas.style.visibility = Visibilities[this.visible];
		if (this.parent !== LayerFragment) this.parent.style.visibility = Visibilities[this.visible];

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
		if (c.type === "button") {
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
			c.text_size[0] = (Math.max(...widths) + 2) * scale;

			// Multiply line number to get the height
			c.text_size[1] = 9 * c.lines.length * scale;
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

	/**
	 * Redraw the specified component(s) on the canvas, or all if omitted (with a canvas clearing).
	 * NOTE: This method doesn't reload the component textures.
	 * @param	{...object}	[cs]	Component(s) to be redrawed
	 */
	this.redraw = (...cs) => {
		let redraw_all = false;

		if (!cs.length) {
			redraw_all = true;
			cs = Object.values(this.components).map(c => c.name);
			this.erase();
		}

		for (let c of cs) {
			if (typeof c === "string") c = this.components[c];
			!redraw_all && this.erase(c);
			this.compute(c).draw(c);
		}

		return this;
	};

	/**
	 * Draw a specified non-text component on the canvas.
	 * @param	{object}	c	Component to be drawed
	 */
	this.draw = c => {
		switch (c.type) {
			default:
				let ox = c.x + (c.w - c.text_size[0]) / 2,
					oy = c.y + (c.h - c.text_size[1]) / 2 + (scale / 2),
					x,
					y = oy;

				for (let l of c.lines) {
					x = ox;

					for (let ch of l) {
						let i = Font.chars.indexOf(ch),
							u = i % 16 * 8,
							v = 8 * (Math.floor(i / 16) + 2);

						if (c.text_shadow) {
							this.ctx.globalAlpha = .8;
							this.ctx.drawImage(
								TEXTURES["font/ascii.png"],
								u,
								v,
								6,
								8,
								x + scale,
								y + scale,
								6 * scale,
								8 * scale,
							);
						}

						x += ((Font.size[ch] ?? 5) + 1) * scale;
					}

					y += 9 * scale;
				}

				this.ctx.globalCompositeOperation = "source-atop";
				this.ctx.fillStyle = c.color;
				this.ctx.fillRect(
					ox + scale,
					oy + scale,
					c.text_size[0],
					c.text_size[1] + (c.text_shadow ? scale : 0),
				);
				this.ctx.globalAlpha = 1;
				this.ctx.globalCompositeOperation = "source-over";

				y = oy;
				for (let l of c.lines) {
					x = ox;

					for (let ch of l) {
						let i = Font.chars.indexOf(ch),
							u = i % 16 * 8,
							v = 8 * (Math.floor(i / 16) + 2);

						this.ctx.globalAlpha = 1;
						this.ctx.drawImage(
							TEXTURES["font/ascii.png"],
							u,
							v,
							6,
							8,
							x,
							y,
							6 * scale,
							8 * scale,
						);

						x += ((Font.size[ch] ?? 5) + 1) * scale;
					}

					y += 9 * scale;
				}

				/*this.ctx.globalCompositeOperation = "source-atop";
				this.ctx.fillStyle = c.color;
				this.ctx.fillRect(
					ox,
					oy,
					c.text_size[0],
					c.text_size[1] + (c.text_shadow ? scale : 0),
				);
				this.ctx.globalAlpha = 1;*/

				let uv = c.hovered ? c.uv2 : c.uv;
				this.ctx.globalCompositeOperation = "destination-over";
				this.ctx.drawImage(
					TEXTURES[c.texture],
					uv[0],
					uv[1],
					c.size[0],
					c.size[1],
					c.x,
					c.y,
					c.w,
					c.h,
				);
				this.ctx.globalCompositeOperation = "source-over";

				break;
		}

		return this;
	};

	/**
	 * Erase the specified component on the canvas, or the whole canvas if omitted.
	 * @param	{object}	[c]	Component to be erased
	 */
	this.erase = c => {
		if (c) {
			let h = c.h + (c.text_shadow ? scale : 0);
			this.ctx.clearRect(c.x, c.y, c.w, h);
		} else this.ctx.clearRect(0, 0, WINDOW.MAX_WIDTH, WINDOW.MAX_HEIGHT);

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