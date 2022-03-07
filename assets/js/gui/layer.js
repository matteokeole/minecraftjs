/**
 * Constructs a new layer
 * @param {string} id - Layer ID (will also be the canvas ID)
 */
function Layer(id, size = [], visible = true) {
	this.id = id;
	this.size = [
		size[0] ? size[0] : WINDOW_WIDTH,
		size[1] ? size[1] : WINDOW_HEIGHT,
	];
	this.visible = visible;
	/**
	 * Toggle layer visibility
	 * @param {boolean} state - The visibility status, will be !this.visible if omitted
	 */
	this.toggle = (state = !this.visible) => {
		this.visible = state;
		this.canvas.style.visibility = this.visible ? "visible" : "hidden";
	};
	this.canvas = document.createElement("canvas");
	this.canvas.id = this.id;
	this.canvas.className = "layer";
	this.canvas.width = this.size[0];
	this.canvas.height = this.size[1];
	this.canvas.style.visibility = this.visible ? "visible" : "hidden";
	this.ctx = this.canvas.getContext("2d");
	this.ctx.imageSmoothingEnabled = false;
	this.components = {};
	this.add = component => {
		// Set the parent layer attribute to the new component before creating it
		component.layer = this;
		this.components[component.id] = component;

		return this;
	};
	this.update = () => {
		// This will update the layer by re-drawing it with the list of its components this.components[]
		// Clear canvas
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		// Loop through layer components
		for (let component of Object.values(this.components)) {
			if (component.visible) {
				// Draw component
				const texture = new Image();
				texture.addEventListener("load", () => {
					this.ctx.drawImage(
						texture,
						component.uv.x,
						component.uv.y,
						component.size.x / 2,
						component.size.y / 2,
						(WINDOW_WIDTH  / 2) - (component.size.x / 2) + component.origin.x,
						(WINDOW_HEIGHT / 2) - (component.size.y / 2) - component.origin.y,
						component.size.x,
						component.size.y,
					);
				});
				texture.src = `assets/textures/${component.texture}`;
			}
		}
	};

	document.body.appendChild(this.canvas);

	return this;
}

const
	// DebugLayer			= new Layer("debug-layer", [], 0),
	UILayer				= new Layer("ui-layer", [], 1),
	SelectorLayer		= new Layer("selector-layer", [], 1),
	ExperienceLayer		= new Layer("experience-layer", [], 1),
	HealthLayer			= new Layer("health-layer", [], 1),
	HungerLayer			= new Layer("hunger-layer", [], 1),
	ContainerLayer		= new Layer("container-layer", [], 0),
	MenuLayer			= new Layer("menu-layer", [], 0);