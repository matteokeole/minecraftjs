/**
 * Construct a new interface layer and append the canvas element to the page.
 *
 * Param	Type		Name				Description						Default value
 * @param	{object}	layer				Layer data object				{}
 * @param	{string}	layer.name			Layer name						"UNKNOWN_LAYER"
 * @param	{integer}	layer.scale			Layer scale multiplier			2
 * @param	{boolean}	layer.visible		Layer visibility attribute		1
 * @param	{object}	layer.components	Layer default component list	{}
 */
export function Layer(layer = {}) {
	// Name
	this.name = layer.name ?? "UNKNOWN_LAYER";

	// Scale multiplier
	this.scale = layer.scale ?? 2;

	// Visibility status
	this.visible = layer.visible ?? 1;

	// Create layer canvas element
	this.canvas = document.createElement("canvas");

	// Get canvas context
	this.ctx = this.canvas.getContext("2d");

	// Component list
	this.components = layer.components ?? {};

	// Loaded texture list (accessible with the component texture value)
	this.loadedTextures = {};

	/**
	 * Scale canvas components.
 	 * @param	{integer}	multiplier			The scale multiplier			2
	 */
	this.setScale = (multiplier = 2) => {
		this.scale = multiplier;

		return this;
	};

	/**
	 * Toggle layer canvas visibility.
 	 * @param	{boolean}	state				The visibility to be applied	Opposite of the current visibility
	 */
	this.toggle = (state = !this.visible) => {
		this.visible = Number(state);

		// Update canvas element visibility
		this.canvas.style.visibility = ["hidden", "visible"][this.visible];
	};

	/**
	 * Add a new component to the layer component list.
	 * @param	{object}	component			The component to be added		undefined
	 */
	this.add = component => {
		// Set the current layer as parent for this component
		component.layer = this;

		// Add component to the list
		this.components[component.name] = component;

		return this;
	};

	/**
	 * Remove a component from the layer component list.
	 * @param	{object}	component			The name of the component		undefined
	 */
	this.remove = component => {
		// Remove component from the list
		this.components[component.name] = undefined;

		return this;
	};

	/**
	 * Load once all component textures into an array which can be used to render components, then calls the callback function.
	 * @param	{function}	callback			The callback function			Function
	 */
	this.loadTextures = (callback = Function()) => {
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
			this.loadedTextures[sources[i]] = new Image();
			this.loadedTextures[sources[i]].addEventListener("load", () => {
				// If all the textures are loaded, call the function with the texture list
				++count === sources.length && callback(this.loadedTextures);
			});
			// The source path starts with "assets/textures/"
			this.loadedTextures[sources[i]].src = "../../assets/textures/" + sources[i];
		}
	};

	/**
	 * Re-draw all the layer visible components on the canvas.
	 * NOTE: The component textures will be reloaded everytime you call this method.
	 */
	this.update = () => {
		// Clear canvas content
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		// Load component textures
		this.loadTextures(loadedTextures => {
			// Loop through layer components
			for (let c of Object.values(this.components)) {
				if (c.visible) {
					this.draw(c);

					// Slot containers
					if (c.slots) {
						for (let slot of c.slots) {
							if (slot.item) {
								const texture = new Image();

								texture.addEventListener("load", () => {
									this.ctx.drawImage(
										texture,
										0,
										0,
										slot.size.x() / this.scale,
										slot.size.y() / this.scale,
										(this.canvas.width / 2) - (slot.size.x() / 2) + slot.origin.x(),
										(this.canvas.height / 2) - (slot.size.y()) - slot.origin.y(),
										slot.size.x(),
										slot.size.y(),
									);
								});
								texture.src = `../../assets/textures/item/${slot.item.name}.png`;
							}
						}
					}
				}
			}
		});
	};

	this.draw = c => {
		if (c.type === "text") {
			let textWidth = 0;

			// Calculate text final width
			for (let char of c.text) {
				textWidth += Font.charSize[char][0] * this.scale;
			}

			c.size.x = () => textWidth + 1;
			c.size.y = () => 12 * this.scale;

			// Text shadow
			let textX = (this.canvas.width / 2) - (textWidth / 2) + c.origin.x() - 1;
			for (let char of c.text) {
				let i = Font.chars.indexOf(char);
				if (i !== -1) {
					// Character found, draw it
					let
						x = i % 16,
						y = Math.floor(i / 16);

					this.ctx.drawImage(
						this.loadedTextures[c.texture],
						x * 8,
						16 + y * 8,
						18 / 3,
						18 / 2.25,
						textX + 2,
						(this.canvas.height / 2) - (18 / 2) - c.origin.y() + 2,
						12,
						16,
					);

					let image = this.ctx.getImageData(
						textX + 2,
						(this.canvas.height / 2) - (18 / 2) - c.origin.y() + 2,
						12,
						16,
					);

					for (let j = 0; j < image.data.length; j += 4) {
						image.data[j] -= 193;
						image.data[j + 1] -= 193;
						image.data[j + 2] -= 193;
					}

					this.ctx.putImageData(
						image,
						textX + 2,
						(this.canvas.height / 2) - (18 / 2) - c.origin.y() + 2,
					);
				}
				textX += Font.charSize[char][0] * 2;
			}

			// Print text
			this.ctx.globalAlpha = 1;
			textX = (this.canvas.width / 2) - (textWidth / 2) + c.origin.x() - 1;
			for (let char of c.text) {
				let i = Font.chars.indexOf(char);
				if (i !== -1) {
					// Character found, draw it
					let
						x = i % 16,
						y = Math.floor(i / 16);

					this.ctx.drawImage(
						this.loadedTextures[c.texture],
						x * 8,
						16 + y * 8,
						18 / 3,
						18 / 2.25,
						textX,
						(this.canvas.height / 2) - (18 / 2) - c.origin.y(),
						12,
						16,
					);

					let image = this.ctx.getImageData(
						textX,
						(this.canvas.height / 2) - (18 / 2) - c.origin.y(),
						12,
						16,
					);

					const rgb = hexToRGB(c.text_color);

					for (let j = 0; j < image.data.length; j += 4) {
						image.data[j] -= (255 - rgb.r);
						image.data[j + 1] -= (255 - rgb.g);
						image.data[j + 2] -= (255 - rgb.b);
					}

					this.ctx.putImageData(
						image,
						textX,
						(this.canvas.height / 2) - (18 / 2) - c.origin.y(),
					);
				}
				textX += Font.charSize[char][0] * 2;
			}
		} else {
			// Pre-calculate component size
			const size = {
				x: c.size.x(),
				y: c.size.y(),
			};

			// Re-draw component
			this.ctx.drawImage(
				this.loadedTextures[c.texture],
				c.uv.x,
				c.uv.y,
				size.x / this.scale,
				size.y / this.scale,
				(this.canvas.width / 2) - (size.x / 2) + c.origin.x(),
				(this.canvas.height / 2) - (size.y / 2) - c.origin.y(),
				size.x,
				size.y,
			);
		}
	};

	this.erase = c => {
		// Pre-calculate component size
		const size = {
			x: c.size.x(),
			y: c.size.y(),
		};

		// Clear the area where is the component
		this.ctx.clearRect(
			(this.canvas.width / 2) - (size.x / 2) + c.origin.x(),
			(this.canvas.height / 2) - (size.y / 2) - c.origin.y(),
			size.x,
			size.y,
		);
	};

	/* Initialization */

	// Set canvas class and ID attributes
	this.canvas.className = "layer";
	this.canvas.id = this.name;

	// Stretch canvas size to the screen size
	this.canvas.width = window.innerWidth;
	this.canvas.height = window.innerHeight;

	// Remove canvas blur effect
	this.ctx.imageSmoothingEnabled = false;

	// Append the layer canvas to the DOM
	document.body.append(this.canvas);

	// Set the canvas visibility for the first time
	this.toggle(this.visible);

	return this;
}

/**
 * Convert an hexadecimal color to its RGB variant.
 * @param	{string}	hex	Hexadecimal code, hash optional.	"#000000"
 */
const hexToRGB = (hex = "#000000") => {
	const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result ? {
		r: parseInt(result[1], 16),
		g: parseInt(result[2], 16),
		b: parseInt(result[3], 16),
	} : null;
};