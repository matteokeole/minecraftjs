/**
 * Constructs a new interface layer
 * @param {object} layer - Layer data
 */
function Layer(layer) {
	this.id = layer.id;
	this.size = [
		WINDOW_WIDTH,
		WINDOW_HEIGHT,
	];
	this.visible = layer.visible;
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
				if (component.type === "text") {
					console.log(component.origin.x)
					this.ctx.fillStyle = "#FFF";
					this.ctx.font = "minecraft_regular 48px";
					this.ctx.fontSize = "48px";
					this.ctx.fillText(
						component.text,
						component.origin.x,
						component.origin.y,
					);
				} else {
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
		}
	};

	document.body.appendChild(this.canvas);

	return this;
}

const
	DebugLayer			= new Layer({
		id: "debug-layer",
		visible: 1,
	}),
	UILayer				= new Layer({
		id: "ui-layer",
		visible: 1,
	}),
	SelectorLayer		= new Layer({
		id: "selector-layer",
		visible: 1,
	}),
	ExperienceLayer		= new Layer({
		id: "experience-layer",
		visible: 1,
	}),
	HealthLayer			= new Layer({
		id: "health-layer",
		visible: 1,
	}),
	HungerLayer			= new Layer({
		id: "hunger-layer",
		visible: 1,
	}),
	ContainerLayer		= new Layer({
		id: "container-layer",
		visible: 0,
	}),
	MenuLayer			= new Layer({
		id: "menu-layer",
		visible: 0,
	});