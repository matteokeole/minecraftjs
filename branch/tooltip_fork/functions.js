import {Settings, Player} from "./variables.js";
import {Component} from "./component.js";
import {Fetch} from "./main.js";

export const
	renderHealth = layer => {
		// Heart outlines
		for (let i = 0; i < Player.max_health / 2; i++) {
			layer.add(
					new Component({
						name: `heart_outline_${i}`,
						origin: ["center", "bottom"],
						offset: [-layer.components.hotbar.size.x / 2 + 4.5 + 8 * i, 30],
						size: [9, 9],
						texture: "gui/icons.png",
						uv: [16, 0],
					}),
				);
		}

		// Heart inners
		let j = 0;
		for (let i = 0; i < Player.health; i++) {
			// Add half-heart if health value is odd
			if (Player.health % 2 !== 0 && i + 1 === Player.health) {
				j = i / 2;
				layer.add(
						new Component({
							name: `heart_inner_${j}`,
							origin: ["center", "bottom"],
							offset: [-layer.components.hotbar.size.x / 2 + 5 + 4 * i, 31],
							size: [8, 7],
							texture: "gui/icons.png",
							uv: [62, 1],
						}),
					);
				break;
			}
			else if (i % 2 === 0) {
				j = i / 2;
				layer.add(
						new Component({
							name: `heart_inner_${j}`,
							origin: ["center", "bottom"],
							offset: [-layer.components.hotbar.size.x / 2 + 5 + 4 * i, 31],
							size: [8, 7],
							texture: "gui/icons.png",
							uv: [53, 1],
						}),
					);
			}
		}
	},
	renderHunger = layer => {
		// Hunger outlines
		for (let i = 0; i < Player.max_hunger / 2; i++) {
			layer.add(
					new Component({
						name: `hunger_outline_${i}`,
						origin: ["center", "bottom"],
						offset: [layer.components.hotbar.size.x / 2 - 4.5 - 8 * i, 30],
						size: [9, 9],
						texture: "gui/icons.png",
						uv: [16, 27],
					}),
				);
		}

		// Hunger inners
		let j = 0;
		for (let i = 0; i < Player.hunger; i++) {
			// Add half-hunger if hunger value is odd
			if (Player.hunger % 2 !== 0 && i + 1 === Player.hunger) {
				j = i / 2;
				layer.add(
						new Component({
							name: `hunger_inner_${j}`,
							origin: ["center", "bottom"],
							offset: [layer.components.hotbar.size.x / 2 - 4 - 4 * i, 30],
							size: [8, 9],
							texture: "gui/icons.png",
							uv: [62, 27],
						}),
					);
			}
			else if (i % 2 === 0) {
				j = i / 2;
				layer.add(
						new Component({
							name: `hunger_inner_${j}`,
							origin: ["center", "bottom"],
							offset: [layer.components.hotbar.size.x / 2 - 4 - 4 * i, 30],
							size: [8, 9],
							texture: "gui/icons.png",
							uv: [53, 27],
						}),
					);
			}
		}
	};

export const
	getAutoScale = () => {
		return (
			window.innerWidth <= 640 || window.innerHeight < 480 ? 1 :
				(window.innerWidth <= 960 || window.innerHeight < 720) && Settings.gui_scale >= 2 ? 2 :
					Settings.gui_scale >= 3 ? 3 : Settings.gui_scale
		);
	},
	draw = (l, c) => {
		// Pre-calculate component size & offset
		const
			size = {
				x: c.size.x * l.scale,
				y: c.size.y * l.scale,
			},
			offset = {
				x: c.offset.x * l.scale,
				y: c.offset.y * l.scale,
			},
			origin = {
				x: offset.x,
				y: offset.y,
			};

		// Switch component type (different drawing method)
		if (c.type === "text") {
			// Explode the text in lines
			const lines = String(c.text).split("\n").map(t => Object({
				text: t,
				width: 0,
			}));

			let max_width = 0;

			// Calculate line widths
			for (let line of lines) {
				for (let char of line.text) {
					line.width += (Fetch.font.char_size[char] ?? 5) + 1;

					// Get the max possible line width
					if (line.width > max_width) max_width = line.width;
				}
			}

			// Update component size
			size.x = (max_width + 2) * l.scale;
			size.y = 9 * lines.length * l.scale;

			// Pre-calculate component origin
			for (let a of ["x", "y"]) {
				switch (c.origin[a]) {
					// Top and left cases are set by default
					case "bottom":
					case "right":
						origin[a] = l.size[a] - size[a] - offset[a];
						break;
					case "center":
						origin[a] = l.size[a] / 2 - size[a] / 2 + offset[a];
						break;
				}
			}

			let textY = origin.y + l.scale;
			for (let line of lines) {
				let textX = origin.x + l.scale;
				for (let char of line.text) {
					let i = Fetch.font.chars.indexOf(char);
					if (i === -1) i = 0;

					let
						u = i % 16,
						v = Math.floor(i / 16);

					if (c.text_shadow) {
						l.ctx.globalAlpha = .245;

						// Draw text shadow
						l.ctx.drawImage(
							l.loadedTextures[c.texture],
							u * 8,
							v * 8 + 16,
							6,
							8,
							textX + l.scale,
							textY + l.scale,
							6 * l.scale,
							8 * l.scale,
						);
					}

					l.ctx.globalAlpha = 1;

					// Draw text value
					l.ctx.drawImage(
						l.loadedTextures[c.texture],
						u * 8,
						v * 8 + 16,
						6,
						8,
						textX,
						textY,
						6 * l.scale,
						8 * l.scale,
					);

					// Move the drawer 1 character to right
					textX += ((Fetch.font.char_size[char] ?? 5) + 1) * l.scale;
				}
				// Move the drawer 1 character to bottom
				textY += 9 * l.scale;
			}

			l.ctx.globalCompositeOperation = "source-atop";
			l.ctx.fillStyle = c.text_color;
			l.ctx.fillRect(
				origin.x,
				origin.y,
				size.x,
				size.y,
			);

			if (c.text_background) {
				l.ctx.globalCompositeOperation = "destination-over";
				l.ctx.fillStyle = c.text_background;
				l.ctx.globalAlpha = c.text_background_alpha;
				l.ctx.fillRect(
					origin.x,
					origin.y,
					size.x,
					size.y,
				);
			}

			l.ctx.globalCompositeOperation = "source-over";
			l.ctx.globalAlpha = 1;
		} else {
			// Pre-calculate component origin
			for (let a of ["x", "y"]) {
				switch (c.origin[a]) {
					// Top and left cases are set by default
					case "bottom":
					case "right":
						origin[a] = l.size[a] - size[a] - offset[a];
						break;
					case "center":
						origin[a] = l.size[a] / 2 - size[a] / 2 + offset[a];
						break;
				}
			}

			// Draw component
			l.ctx.drawImage(
				l.loadedTextures[c.texture],
				c.uv.x,
				c.uv.y,
				size.x / l.scale,
				size.y / l.scale,
				origin.x,
				origin.y,
				size.x,
				size.y,
			);
		}
	},
	erase = (l, c) => {
		// Pre-calculate component size & offset
		const
			size = {
				x: c.size.x * l.scale,
				y: c.size.y * l.scale,
			},
			offset = {
				x: c.offset.x * l.scale,
				y: c.offset.y * l.scale,
			},
			origin = {
				x: offset.x,
				y: offset.y,
			};

		// Pre-calculate component origin
		for (let a of axes) {
			switch (c.origin[a]) {
				// Top and left cases are set by default
				case "bottom":
				case "right":
					origin[a] = l.size[a] - size[a] - offset[a];
					break;
				case "center":
					origin[a] = l.size[a] / 2 - size[a] / 2 + offset[a];
					break;
			}
		}

		// Clear the area where is located the component
		l.ctx.clearRect(
			c.origin.x,
			c.origin.y,
			size.x,
			size.y,
		);
	};

/**
 * Convert an hexadecimal color to its RGB variant.
 * @param	{string}	hex	Hexadecimal code, hash optional.	undefined
 */
const hexToRGB = hex => {
	const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result ? {
		r: parseInt(result[1], 16),
		g: parseInt(result[2], 16),
		b: parseInt(result[3], 16),
	} : null;
};

export const
	/**
	 * Generate scripts to get current JavaScript version.
	 */
	get_js_version = () => {
		for (let i = 1; i <= 9; i++) {
			// Create new script element
			let script = document.createElement("script");

			script.setAttribute("language", `javascript1.${i}`);
			script.textContent = `js = 1.${i}`;

			document.body.append(script);
		}
		
		return js;
	},
	/**
	 * Return platform architecture number.
	 */
	get_platform_architecture = () => {
		return (navigator.userAgent.indexOf("WOW64") !== 1 || navigator.platform === "Win64") ? 64 : 32;
	};