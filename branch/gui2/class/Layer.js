import {WINDOW} from "../main.js";

var SOURCES = [];

// CSS visibility attributes
const Visibilities = ["hidden", "visible"];

export const
	// Layer fragment element
	LayerFragment = document.createDocumentFragment(),
	/**
	 * Build a new interface layer with an associated canvas.
	 *
	 * Param	Type				Name=Default			Description
	 * @param	{object}			[layer={}]				Layer data object
	 * @param	{string}			layer.name				Name (used as canvas class attribute)
	 * @param	{boolean|number}	[layer.visible=true]	Visibility state
	 * @param	{array}				[layer.components={}]	Component list
	 */
	Layer = function(layer = {}) {
		// Name
		this.name = layer.name;

		// Visibility
		this.visible = layer.visible ?? true;

		// Component and button lists
		this.components = {};
		this.buttons = [];

		// Fill in the component lists
		for (let component of layer.components) {
			// Set this layer as the component parent
			component.layer = this;

			this.components[component.name] = component;
			component.type === "button" && this.buttons.push(component);

			// Add the component texture to the texture source list
			component.texture && SOURCES.push(component.texture);
		}

		// Canvas
		this.canvas = document.createElement("canvas");
		this.canvas.className = `layer ${this.name}`;
		this.canvas.width = WINDOW.MW;
		this.canvas.height = WINDOW.MH;
		this.canvas.style.visibility = Visibilities[this.visible];

		// Canvas context
		this.ctx = this.canvas.getContext("2d");
		this.ctx.imageSmoothingEnabled = false;

		// Append the layer canvas to the fragment
		LayerFragment.appendChild(this.canvas);
	};