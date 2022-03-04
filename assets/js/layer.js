/**
 * Constructs a new layer
 * @param {string} id - Layer ID (will also be the canvas ID)
 */
function Layer(id, width = WINDOW_WIDTH, height = WINDOW_HEIGHT) {
	this.id = id;
	this.visible = true;
	this.setVisibility = visibility => {
		this.visible = visibility;
		this.canvas.style.visibility = this.visible ? "visible" : "hidden";
	};
	this.canvas = document.createElement("canvas");
	this.canvas.id = this.id;
	this.canvas.className = "layer";
	this.canvas.width = width;
	this.canvas.height = height;
	this.ctx = this.canvas.getContext("2d");
	this.ctx.imageSmoothingEnabled = false;
	this.components = {
		list: [],
		add: component => {
			component.layer = this;
			this.components.list.push(component);
			return this.components;
		},
		get: component => {
			return this.components.list.filter(c => component === c.id)[0];
		},
	};
	this.update = () => {
		// This will update the layer by re-drawing it with the list of its components this.components[]
		// Clear canvas
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		// Loop through layer components
		for (let component of Object.values(this.components.list)) {
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
	DebugLayer			= new Layer("debug-layer"),
	UILayer				= new Layer("ui-layer"),
	SelectorLayer		= new Layer("selector-layer"),
	ExperienceLayer		= new Layer("experience-layer"),
	HealthLayer			= new Layer("health-layer"),
	HungerLayer			= new Layer("hunger-layer"),
	UIContainerLayer	= new Layer("ui-container-layer");