import {Settings, axes} from "./variables.js";
import {Fetch} from "./main.js";

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
			size.x = max_width * l.scale;
			size.y = 10 * lines.length * l.scale;

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

			let textY = origin.y;
			for (let line of lines) {
				let textX = origin.x;
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
							textX + 2,
							textY + 2,
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
				textY += 10 * l.scale;
			}

			l.ctx.globalCompositeOperation = "source-atop";
			l.ctx.fillStyle = c.text_color;
			l.ctx.fillRect(
				origin.x,
				origin.y,
				size.x,
				size.y,
			);
			l.ctx.globalCompositeOperation = "source-over";
		} else {
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
		// Pre-calculate component size
		const size = {
			x: c.size.x(),
			y: c.size.y(),
		};

		// Clear the area where is located the component
		if (c.type === "text") {
			l.ctx.clearRect(
				c.origin.x(),
				c.origin.y(),
				size.x + 2,
				size.y,
			);
		} else {
			l.ctx.clearRect(
				c.origin.x() - size.x / 2,
				c.origin.y() - size.y / 2,
				size.x,
				size.y,
			);
		}
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