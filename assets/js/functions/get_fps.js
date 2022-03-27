import {UI} from "../main.js";

export let
	start = performance.now(), // Start time
	frames = 0, // Number of frames elapsed
	delay = 1000, // Graphical update delay
	/**
	 * Display the current framerate on the debug menu.
	 */
	get_fps = () => {
		let now = performance.now(),
			difference = now - start;

		// Increment frame count
		frames++;

		if (difference > delay) {
			// Update the FPS counter each second
			UI.debug.get("fps").text = `${frames} fps`;
			UI.debug.redraw("fps");

			// Reset start value and frame count
			start = now;
			frames = 0;
		}

		requestAnimationFrame(get_fps);
	};