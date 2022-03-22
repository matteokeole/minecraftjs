import {WINDOW, LOADED_TEXTURES, Font, layer_set, scale} from "./main.js";
export function Layer(l = {}) {
	this.name = l.name;
	this.parent = l.parent ?? layer_set;
	this.w = WINDOW.WIDTH;
	this.h = WINDOW.HEIGHT;
	this.components = l.components ?? {};
	let component_entries = Object.entries(this.components),
		component_values = Object.values(this.components);
	this.canvas = document.createElement("canvas");
	this.canvas.className = `layer ${this.name}`;
	this.canvas.width = WINDOW.MAX_WIDTH;
	this.canvas.height = WINDOW.MAX_HEIGHT;
	this.ctx = this.canvas.getContext("2d");
	this.ctx.imageSmoothingEnabled = false;
	this.resize = (w = WINDOW.WIDTH, h = WINDOW.HEIGHT) => {
		this.w = w;
		this.h = h;
		return this;
	};
	this.visible = l.visible ?? 1;
	let visibilities = ["hidden", "visible"];
	this.toggle = (v = !this.visible) => {
		this.visible = Number(v);
		this.canvas.style.visibility = visibilities[this.visible];
		return this;
	};
	this.compute = c => {
		let o = [
			c.offset[0] * scale,
			c.offset[1] * scale,
		];
		if (c.type === "text") {
			// Explode the text in lines
			c.lines = c.text.split("\n");
			let widths = [];
			// Calculate line widths
			for (let l of c.lines) {
				let width = 0;
				for (let c of l) {
					width += (Font.size[c] ?? 5) + 1;
				}
				widths.push(width);
			}
			c.size[0] = Math.max(...widths) + 2;
			c.size[1] = 9 * c.lines.length;
		}
		c.w = c.size[0] * scale;
		c.h = c.size[1] * scale;
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
	this.load_textures = callback => {
		let sources = [...new Set(component_values.map(c => c.texture))],
			source_length = sources.length,
			count = 0;
		for (let i of sources) {
			if (i in LOADED_TEXTURES) {
				LOADED_TEXTURES[i].addEventListener("load", () => {
					callback && ++count === source_length && callback();
				});
			} else {
				LOADED_TEXTURES[i] = new Image();
				LOADED_TEXTURES[i].addEventListener("load", () => {
					callback && ++count === source_length && callback();
				});
				LOADED_TEXTURES[i].src = `assets/textures/${i}`;
			}
		}
	};
	this.update = () => {
		this.load_textures(this.redraw);
		return this;
	};
	this.redraw = (...cs) => {
		let redraw_single = true;
		if (!cs.length) {
			redraw_single = false;
			cs = component_values.map(c => c.name);
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
			this.ctx.drawImage(
				LOADED_TEXTURES[c.texture],
				c.uv[0], c.uv[1],
				c.size[0], c.size[1],
				c.x, c.y,
				c.w, c.h,
			);
			if (c.type === "container") {
				for (let s of c.slots) {
					c.compute_slot(s).draw_slot(s);
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

	for (let c of component_entries) {
		c[1].name = c[0];
		c[1].layer = this;
	}
	this.parent.appendChild(this.canvas);
	this.toggle(this.visible);
}
