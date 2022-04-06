import {Font, scale} from "../../../branch/gui/button/main.js";

/**
 * Compute and return the given string.
 * @param	{string}	text	Inline or multiline string
 */
export const compute_text = text => {
	// Explode the text in lines
	let lines = text.split("\n").map(l => Object({
			chars: l.split("").map(c => Object({
				letter: c,
				x: 0,
				y: 0,
				u: 0,
				v: 0,
			})),
			height: 10,
		})),
		x = 0,
		y = 0,
		max_width = [],
		max_height = 0,
		raw = [];

	// The first line has a bottom offset
	lines[1] && (lines[0].height = 12);

	// Calculate each line width
	for (let line of lines) {
		let width = 0;
		x = 0;

		for (let char of line.chars) {
			let i = Font.chars.indexOf(char.letter),
				w = ((Font.size[char.letter] ?? 5) + 1);

			char.x = x;
			char.y = y;
			char.u = i % 16 * 8;
			char.v = 8 * (Math.floor(i / 16) + 2);
			width += w;

			raw.push(char);

			x += w * scale;
		}

		y += line.height * scale;

		max_width.push(width);
		max_height += line.height;
	}

	// Calculate final text size
	max_width = Math.max(...max_width) * scale;
	max_height *= scale;

	return {
		raw: raw,
		lines: lines,
		max_width: max_width,
		max_height: max_height,
	};
};