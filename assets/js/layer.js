import {WINDOW, LOADED_TEXTURES, layers, gui_scale} from "./main.js";

export function Layer(l = {}) {
	this.name = l.name;
	this.parent = l.parent ?? layers;
	this.w = WINDOW.WIDTH;
	this.h = WINDOW.HEIGHT;
	this.components = l.components ?? {};
	let component_entries = Object.entries(this.components),
		component_values = Object.values(this.components);
	this.canvas = document.createElement("canvas");
	this.canvas.className = "layer";
	this.canvas.id = this.name;
	this.canvas.width = WINDOW.MAX_WIDTH;
	this.canvas.height = WINDOW.MAX_HEIGHT;
	this.ctx = this.canvas.getContext("2d");
	this.ctx.imageSmoothingEnabled = false;
	this.resize = (w = WINDOW.WIDTH, h = WINDOW.HEIGHT) => {
		this.w = w;
		this.h = h;
		return this;
	};
	this.compute = c => {
		let o = [
			c.offset[0] * gui_scale,
			c.offset[1] * gui_scale,
		];
		c.w = c.size[0] * gui_scale;
		c.h = c.size[1] * gui_scale;
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
	this.update = () => {
		let sources = [...new Set(component_values.map(c => c.texture))],
			source_length = sources.length,
			count = 0;
		for (let i of sources) {
			if (!LOADED_TEXTURES[i]) {
				LOADED_TEXTURES[i] = new Image();
				LOADED_TEXTURES[i].addEventListener("load", () => {
					++count === source_length && this.redraw();
				});
				LOADED_TEXTURES[i].src = `assets/textures/${i}`;
			}
		}
		return this;
	};
	this.redraw = (...cs) => {
		if (!cs.length) {
			cs = component_values.map(c => c.name);
			this.erase();
		}
		for (let c of cs) {
			c = this.components[c];
			this.compute(c);
			this.draw(c);
		}
		return this;
	};
	this.draw = c => {
		this.ctx.drawImage(
			LOADED_TEXTURES[c.texture],
			c.uv[0],
			c.uv[1],
			c.size[0],
			c.size[1],
			c.x,
			c.y,
			c.w,
			c.h,
		);
		return this;
	};
	this.erase = c => {
		c ? this.ctx.clearRect(c.x, c.y, c.w, c.h) : this.ctx.clearRect(0, 0, this.w, this.h);
		return this;
	};

	for (let c of component_entries) {
		c[1].name = c[0];
		c[1].layer = this;
	}

	this.parent.appendChild(this.canvas);
}