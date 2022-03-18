import {Fetch} from "./main.js";

export const
	draw = (l, c) => {
		if (c.type === "text") {
			// Split the text by line
			const lines = String(c.text).split("\n").map(t => {
				return {
					text: t,
					width: 0,
				};
			});

			let maxWidth = 0;

			// Calculate each line width
			for (let line of lines) {
				for (let char of line.text) {
					line.width += (Fetch.font.char_size[char] ? Fetch.font.char_size[char][0] * l.scale : 6 * l.scale) + 2;

					// Get the max possible line width
					if (line.width > maxWidth) maxWidth = line.width;
				}
			}

			maxWidth -= 2;

			// Update component size
			c.size.x = () => maxWidth;
			c.size.y = () => 18 * lines.length;

			let textY = c.origin.y();
			for (let line of lines) {
				let textX = c.origin.x();
				for (let char of line.text) {
					let i = Fetch.font.chars.indexOf(char);
					if (i === -1) i = 0;

					let
						x = i % 16,
						y = Math.floor(i / 16);

					if (c.text_shadow) {
						l.ctx.globalAlpha = .245;
						// Draw text shadow
						l.ctx.drawImage(
							l.loadedTextures[c.texture],
							x * 8,
							16 + y * 8,
							6,
							8,
							textX + 2,
							textY + 2,
							12,
							16,
						);
					}

					l.ctx.globalAlpha = 1;

					// Draw text value
					l.ctx.drawImage(
						l.loadedTextures[c.texture],
						x * 8,
						16 + y * 8,
						6,
						8,
						textX,
						textY,
						12,
						16,
					);

					textX += 2 * (Fetch.font.char_size[char] ? Fetch.font.char_size[char][0] : 6) + 2;
				}
				textY += 18;
			}

			l.ctx.globalCompositeOperation = "source-atop";
			l.ctx.fillStyle = c.text_color;
			l.ctx.fillRect(
				c.origin.x(),
				c.origin.y(),
				c.size.x() + 2,
				c.size.y(),
			);
			l.ctx.globalCompositeOperation = "source-over";
		} else {
			// Re-draw component
			l.ctx.drawImage(
				l.loadedTextures[c.texture],
				c.uv.x,
				c.uv.y,
				c.size.x() / l.scale,
				c.size.y() / l.scale,
				c.origin.x() - c.size.x() / 2,
				c.origin.y() - c.size.y() / 2,
				c.size.x(),
				c.size.y(),
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