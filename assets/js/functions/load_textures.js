import {LAYERS, TEXTURES} from "../main.js";

export const load_textures = callback => {
		// Get the texture sources list
		let sources = [];
		for (let l of LAYERS) {
			Object.values(l.components).map(c => c.texture && sources.push(c.texture));
		}

		// Get rid of duplicate sources
		sources = [...new Set(sources)];

		let sources_length = sources.length,
			i = 0;

		// If the texture isn't in the list, load it into an image
		for (let s of sources) {
			if (!(s in TEXTURES)) {
				TEXTURES[s] = new Image();
				TEXTURES[s].addEventListener("load", () => {
					// Run the callback function when all textures are loaded
					++i === sources_length && callback();
				});
				TEXTURES[s].src = `assets/textures/${s}`;
			}
		}
	};