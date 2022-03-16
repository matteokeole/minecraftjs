import {Fetch} from "./main.js";

export const
	draw = (l, c) => {
		if (c.type === "text") {
			// Split the text by line
			const lines = c.text.split("\n").map(t => {
				return {
					text: t,
					width: 0,
				};
			});

			let maxWidth = 0;

			// Calculate each line width
			for (let line of lines) {
				for (let char of line.text) {
					line.width += Fetch.font.char_size[char] ? Fetch.font.char_size[char][0] * l.scale : 6 * l.scale;

					// Get the max possible line width for this text
					if (line.width > maxWidth) maxWidth = line.width;
				}
			}

			// Update component size
			c.size.x = () => maxWidth + 1;
			c.size.y = () => 12 * lines.length * l.scale;

			// Why do I need this?
			l.ctx.fillRect(0, 0, 0, 0);

			let textY = (l.canvas.height / 2) + 12 - c.origin.y();
			for (let line of lines) {
				let textX = (l.canvas.width / 2) - (c.size.x() / 2) + c.origin.x();
				for (let char of line.text) {
					let i = Fetch.font.chars.indexOf(char);
					if (i === -1) i = 0;

					let
						x = i % 16,
						y = Math.floor(i / 16);

					if (c.text_shadow) {
						// Draw text shadow
						l.ctx.drawImage(
							l.loadedTextures[c.texture],
							x * 8,
							16 + y * 8,
							18 / 3,
							18 / 2.25,
							textX + 2,
							(l.canvas.height / 2) - (18 / 2) - c.origin.y() + textY + 2,
							12,
							16,
						);

						let image = l.ctx.getImageData(
							textX + 2,
							(l.canvas.height / 2) - (18 / 2) - c.origin.y() + textY + 2,
							12,
							18,
						);

						for (let j = 0; j < image.data.length; j += 4) {
							image.data[j] -= 193;
							image.data[j + 1] -= 193;
							image.data[j + 2] -= 193;
						}

						l.ctx.putImageData(
							image,
							textX + 2,
							(l.canvas.height / 2) - (18 / 2) - c.origin.y() + textY + 2,
						);
					}

					// Draw text value
					l.ctx.drawImage(
						l.loadedTextures[c.texture],
						x * 8,
						16 + y * 8,
						18 / 3,
						18 / 2.25,
						textX,
						(l.canvas.height / 2) - (18 / 2) - c.origin.y() + textY,
						12,
						16,
					);

					let image = l.ctx.getImageData(
						textX,
						(l.canvas.height / 2) - (18 / 2) - c.origin.y() + textY,
						12,
						18,
					);

					const rgb = hexToRGB(c.text_color);

					for (let j = 0; j < image.data.length; j += 4) {
						image.data[j] -= (255 - rgb.r);
						image.data[j + 1] -= (255 - rgb.g);
						image.data[j + 2] -= (255 - rgb.b);
					}

					l.ctx.putImageData(
						image,
						textX,
						(l.canvas.height / 2) - (18 / 2) - c.origin.y() + textY,
					);

					textX += Fetch.font.char_size[char] ? Fetch.font.char_size[char][0] * 2 : 6 * 2;
				}
				textY += 12 * 2;
			}
		} else {
			// Pre-calculate component size
			const size = {
				x: c.size.x(),
				y: c.size.y(),
			};

			// Re-draw component
			l.ctx.drawImage(
				l.loadedTextures[c.texture],
				c.uv.x,
				c.uv.y,
				size.x / l.scale,
				size.y / l.scale,
				(l.canvas.width / 2) - (size.x / 2) + c.origin.x(),
				(l.canvas.height / 2) - (size.y / 2) - c.origin.y(),
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

		// Clear the area where is the component
		l.ctx.clearRect(
			(l.canvas.width / 2) - (size.x / 2) + c.origin.x(),
			(l.canvas.height / 2) - (size.y / 2) - c.origin.y(),
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