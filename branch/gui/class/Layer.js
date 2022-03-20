import {CONST, Settings} from "./../variables.js";
import {get_auto_scale, draw, erase} from "./../functions.js";

/**
 * Construct a new interface layer with an associated canvas.
 *
 * Param	Type		Name/Default					Description
 * @param	{object}	[layer={}]						Layer data object
 * @param	{string}	[layer.name=""]					Layer name (used as canvas ID)
 * @param	{string}	[layer.parent=document.body]	Layer DOM parent
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
	 * @param	{integer}	[width=window.innerWidth]	Width value
	 * @param	{integer}	[height=window.innerHeight]	Height value
	 */
	this.resize = (width = window.innerWidth, height = window.innerHeight) => {
		this.w = width;
		this.h = height;

		return this;
	};

	/**
	 * Toggle the layer visibility using a canvas CSS attribute. If omitted, the state will be the opposite of the current layer visibility.
 	 * @param	{boolean}	[state=!this.visible]	The visibility to be applied
	 */
	this.toggle = (state = !this.visible) => {
		this.visible = Number(state);

		this.canvas.style.visibility = ["hidden", "visible"][this.visible];

		return this;
	};

	/**
	 * Load once all component textures into an array which can be used to render components, then calls the callback function.
	 * @param	{function}	callback			The callback function			Function
	 */
	this.load_textures = (callback = Function()) => {
		let sources = [];

		// Get the list of component texture sources
		for (let i of Object.values(this.components)) {
			i.texture && sources.push(i.texture);
		}

		// Get rid of duplicate sources
		sources = [...new Set(sources)];

		// Load each texture into an image element
		let count = 0;
		for (let i in sources) {
			// Create new image
			this.loaded_textures[sources[i]] = new Image();
			this.loaded_textures[sources[i]].addEventListener("load", () => {
				// Exec the callback when all textures all loaded
				++count === sources.length && callback();
			});
			// The source path starts with "assets/textures/"
			this.loaded_textures[sources[i]].src = "../../assets/textures/" + sources[i];
		}
	};

	this.get_absolute_position = c => {
		// Set component scaled size
		c.w = c.size.x * Settings.gui_scale;
		c.h = c.size.y * Settings.gui_scale;

		// Calculate component absolute position
		const o = {
			x: c.offset.x * Settings.gui_scale,
			y: c.offset.y * Settings.gui_scale,
		};

		switch (c.origin.x) {
			case "left":
				c.x = o.x;
				break;
			case "right":
				c.x = this.w - c.w - o.x;
				break;
			case "center":
				c.x = this.w / 2 - c.w / 2 + o.x;
				break;
		}

		switch (c.origin.y) {
			case "top":
				c.y = o.y;
				break;
			case "bottom":
				c.y = this.h - c.h - o.y;
				break;
			case "center":
				c.y = this.h / 2 - c.h / 2 + o.y;
				break;
		}

		return this;
	};

	/**
	 * Reload the component textures and redraw all components on the canvas.
	 */
	this.update = () => {
		// Clear the canvas
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		// Reload textures
		this.load_textures(this.redraw);
	};

	/**
	 * Redraw the specified component(s) on the canvas, or all if omitted.
	 * NOTE: This method won't reload the textures. Use Layer.update() instead.
	 * @param	{...object}	components	Component(s) to be redrawed
	 */
	this.redraw = (...components) => {
		if (!components.length) components = Object.values(this.components).map(c => c.name);

		// Redraw specific components
		for (let component of components) {
			if (!this.components[component]) return console.error(new Error(`Drawer error: "${component}" is not a children of "${this.name}".`));

			// Component found
			const c = this.components[component];

			if (c.visible) {
				this
					.get_absolute_position(c)
					.ctx.drawImage(
						this.loaded_textures[c.texture],
						c.uv.x,
						c.uv.y,
						c.size.x,
						c.size.y,
						c.x,
						c.y,
						c.w,
						c.h,
					);
			}
		}
		// Load component textures
		/*this.load_textures(() => {
			// Loop through layer components
			for (let c of Object.values(this.components)) {
				if (c.visible) {
					draw(this, c);

					// Slot containers
					if (c.slots) {
						const
							size = {
								x: c.size.x * this.scale,
								y: c.size.y * this.scale,
							},
							offset = {
								x: c.offset.x * this.scale,
								y: c.offset.y * this.scale,
							},
							origin = {
								x: offset.x,
								y: offset.y,
							};

						// Pre-calculate component origin
						for (let a of ["x", "y"]) {
							switch (c.origin[a]) {
								// Top and left cases are set by default
								case "bottom":
								case "right":
									origin[a] = this.size[a] - size[a] - offset[a];
									break;
								case "center":
									origin[a] = this.size[a] / 2 - size[a] / 2 + offset[a];
									break;
							}
						}

						for (let slot of c.slots) {
							// Pre-calculate slot size & offset
							const
								slot_size = {
									x: slot.size.x * this.scale,
									y: slot.size.y * this.scale,
								},
								slot_offset = {
									x: slot.offset.x * this.scale,
									y: slot.offset.y * this.scale,
								};

							// Pre-calculate slot origin
							for (let a of ["x", "y"]) {
								switch (slot.origin[a]) {
									// Top and left cases are set by default
									case "top":
									case "left":
										slot[a] = origin[a] + slot_offset[a];
										break;
									case "bottom":
									case "right":
										slot[a] = origin[a] + size[a] - slot_size[a] - slot_offset[a];
										break;
									case "center":
										slot[a] = origin[a] + size[a] / 2 - slot_size[a] / 2 + slot_offset[a];
										break;
								}
							}

							if (slot.item) {
								const texture = new Image();

								texture.addEventListener("load", () => {
									this.ctx.drawImage(
										texture,
										-1,
										-1,
										slot.size.x,
										slot.size.y,
										slot.x,
										slot.y,
										slot.size.x * this.scale,
										slot.size.y * this.scale,
									);
								});
								texture.src = `../../assets/textures/item/${slot.item.name}.png`;
							}
						}
					}
				}
			}
		});*/
	};

	/* Initialization */

	// Init layer components
	for (let component of Object.entries(this.components)) {
		component[1].name = component[1].name ?? component[0];
		component[1].layer = this;
	}

	// Set canvas class and ID attributes
	this.canvas.className = "layer";
	this.canvas.id = this.name;

	// Stretch canvas size to the full screen size
	this.canvas.width = window.screen.width;
	this.canvas.height = window.screen.height;

	// Remove canvas blur effect
	this.ctx.imageSmoothingEnabled = false;

	// Append the canvas element to the layer parent
	this.parent.append(this.canvas);

	// Set the default canvas visibility
	this.toggle(this.visible);

	return this;
};

let layer_count = 0;

/*

Layer.toggle()
Layer.resize()
Layer.update() = reload textures + clear + redraw
Layer.redraw()

Remove
Layer.set_scale()
Layer.add()
Layer.remove()

Base origin
c.origin.x
c.origin.y
Base size
c.size.x
c.size.y
Base offset
c.offset.x
c.offset.y

c.origin = []
c.offset = []
c.size = []

Absolute position
c.x
c.y
Scaled size
c.w
c.h

*/