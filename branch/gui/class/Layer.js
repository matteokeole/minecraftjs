import {print} from "./../functions.js";
import {Settings} from "./../variables.js";

let i = 0;

/**
 * Construct a new interface layer with an associated canvas.
 *
 * Param	Type		Name=Default					Description
 * @param	{object}	[layer={}]						Layer data object
 * @param	{string}	[layer.name=`layer_${i}`]		Layer name (used as canvas ID)
 * @param	{object}	[layer.parent=document.body]	Layer DOM parent
 * @param	{boolean}	[layer.visible=1]				Layer visibility state
 * @param	{object}	[layer.components={}]			Layer component list
 */
export const Layer = function(layer = {}) {
	// Name
	this.name = layer.name ?? `layer_${++layer_count}`;

	// DOM parent
	this.parent = layer.parent ?? document.body;

	// Size
	this.w = window.innerWidth;
	this.h = window.innerHeight;

	// Visibility
	this.visible = layer.visible ?? 1;

	// Canvas
	this.canvas = document.createElement("canvas");

	// Canvas context
	this.ctx = this.canvas.getContext("2d");

	// Component list
	this.components = layer.components ?? {};

	// Loaded texture list
	this.loaded_textures = {};

	/**
	 * Set the layer size.
	 * NOTE: The new size will be applied on the layer components after a canvas update.
	 * @param	{number}	[width=window.innerWidth]	Width value
	 * @param	{number}	[height=window.innerHeight]	Height value
	 */
	this.resize = (width = window.innerWidth, height = window.innerHeight) => {
		this.w = width;
		this.h = height;

		return this;
	};

	/**
	 * Toggle layer visibility using a canvas CSS attribute. If omitted, the state will be the opposite of the current visibility.
 	 * @param	{boolean}	[state=!this.visible]	The new visibility value
	 */
	this.toggle = (state = !this.visible) => {
		this.visible = Number(state);

		this.canvas.style.visibility = ["hidden", "visible"][this.visible];

		return this;
	};

	/**
	 * Add component(s) to the layer.
	 * NOTE: The new components will be drawn after a canvas update.
	 * @param	{...object}	components	Component(s) to be added
	 */
	this.add = (...components) => {
		for (let component of components) {
			// Link the component to this layer
			component.layer = this;

			this.components[component.name] = component;
		}

		return this;
	};

	/**
	 * Calculate the component scaled size/offset and absolute position.
 	 * @param	{object}	component	Component
	 */
	this.compute = c => {
		// Set component scaled size
		c.w = c.size[0] * Settings.gui_scale;
		c.h = c.size[1] * Settings.gui_scale;

		// Set component scaled offset
		const o = [
			c.offset[0] * Settings.gui_scale,
			c.offset[1] * Settings.gui_scale,
		];

		// Calculate component absolute X position
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

		// Calculate component absolute Y position
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
	 * Reload the component textures and redraw all components on the canvas.
	 * NOTE: This method reloads the component textures each time it is called.
	 */
	this.update = () => {
		let sources = [], count = 0;

		// Get the list of component texture sources
		Object.values(this.components).forEach(c => c.texture && sources.push(c.texture));

		// Get rid of duplicate sources
		sources = [...new Set(sources)];

		// Load each texture into an image
		for (let i in sources) {
			this.loaded_textures[sources[i]] = new Image();
			this.loaded_textures[sources[i]].addEventListener("load", () => {
				// Redraw components when all textures are loaded
				++count === sources.length && this.redraw();
			});
			this.loaded_textures[sources[i]].src = `../../assets/textures/${sources[i]}`;
		}

		return this;
	};

	/**
	 * Redraw the specified component(s) on the canvas, or all if omitted (with a canvas clearing).
	 * NOTE: This method doesn't reload the component textures.
	 * @param	{...object}	components	Component(s) to be redrawed
	 */
	this.redraw = (...components) => {
		let all = false;

		// Get all components if the param is omitted
		if (!components.length) {
			all = true;

			components = Object.values(this.components).map(c => c.name);

			// Clear the canvas
			this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		}

		for (let component of components) {
			// Check if the component is defined
			if (!this.components[component]) return console.error(new Error(`"${component}" is not a children of the layer "${this.name}".`));

			const c = this.components[component];

			// Check if the component texture is loaded
			if (!this.loaded_textures[c.texture]) return console.error(new Error(`Can't find the loaded texture of "${c.name}" (from layer "${this.name}").`));

			if (c.visible) {
				this.compute(c);

				// Clear the area where is the component
				if (!all) this.erase(c);

				// Adapt the drawing method to the component type
				if (c.type === "text") print(c);
				else this.draw(c);
			}
		}

		return this;
	};

	/**
	 * Draw a specified non-text component on the canvas.
	 * @param	{object}	c	Component to be drawed
	 */
	this.draw = c => {
		this.ctx.drawImage(
			this.loaded_textures[c.texture],
			c.uv[0],
			c.uv[1],
			c.size[0],
			c.size[1],
			c.x,
			c.y,
			c.w,
			c.h,
		);

		if (c.type === "container") {
			for (let slot of c.slots) {
				this.compute(slot);

				slot.inner_size[0] = (slot.size[0] - 2) * Settings.gui_scale;
				slot.inner_size[1] = (slot.size[1] - 2) * Settings.gui_scale;
				slot.x += this.w / 2 - c.w / 2;
				slot.y -= this.h / 2 - c.h / 2;

				if (slot.item) {
					const texture = new Image();
					texture.addEventListener("load", () => {
						this.ctx.drawImage(
							texture,
							0,
							0,
							16,
							16,
							slot.x + Settings.gui_scale,
							slot.y + Settings.gui_scale,
							slot.inner_size[0],
							slot.inner_size[1],
						);
					});
					texture.src = `../../assets/textures/item/${slot.item.name}.png`;
				}
			}
		}

		return this;
	};

	/**
	 * Erase the specified component on the canvas.
	 * @param	{object}	c	Component to be erased
	 */
	this.erase = c => {
		let h = c.h + (c.type === "text" ? Settings.gui_scale : 0);

		this.ctx.clearRect(c.x, c.y, c.w, h);

		return this;
	};

	/* Initialization */

	// Initialize layer components
	Object.entries(this.components).forEach(c => {
		c[1].name = c[1].name ?? c[0];
		c[1].layer = this;
	});

	// Set canvas class and ID
	this.canvas.className = "layer";
	this.canvas.id = this.name;

	// Stretch the canvas to the full screen size
	this.canvas.width = window.screen.width;
	this.canvas.height = window.screen.height;

	// Remove canvas blur effect
	this.ctx.imageSmoothingEnabled = false;

	// Append the canvas to the layer parent
	this.parent.append(this.canvas);

	// Set default canvas visibility
	this.toggle(this.visible);

	return this;
};