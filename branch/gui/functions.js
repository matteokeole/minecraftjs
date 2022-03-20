import {Settings, Player} from "./variables.js";
import {Component} from "./class/Component.js";
import {Fetch, UI} from "./main.js";

let startTime = performance.now(),
	frame = 0;

export const
	update_scale = () => {
		let scale = Settings.user_gui_scale,
			default_width = 320,
			default_height = 240;

		for (let i = Settings.user_gui_scale; i > 0; i--) {
			if (
				window.innerWidth <= (i + 1) * default_width ||
				window.innerHeight < (i + 1) * default_height
			) scale = i;
		}

		Settings.gui_scale = scale;

		// Update CSS scale variable
		document.documentElement.style.setProperty("--scale", `${Settings.gui_scale}px`);

		// Update layers
		for (let layer of Object.values(UI)) {
			layer
				.resize()
				.redraw();
		}
	},
	render_health = () => {
		// Heart outlines
		for (let i = 0; i < Player.max_health / 2; i++) {
			UI.hud.add(
				new Component({
					name: `heart_outline_${i}`,
					origin: ["center", "bottom"],
					offset: [
						-UI.hud.components.hotbar.size[0] / 2 + 4.5 + 8 * (i % 10),
						30 + 10 * Math.floor(i / 10),
					],
					size: [9, 9],
					texture: "gui/icons.png",
					uv: [16, 0],
				}),
			);
		}

		// Heart inners
		let i = 0;
		for (i; i < Math.floor(Player.health / 2); i++) {
			UI.hud.add(
				new Component({
					name: `heart_inner_${i}`,
					origin: ["center", "bottom"],
					offset: [
						-UI.hud.components.hotbar.size[0] / 2 + 5 + 8 * (i % 10),
						31 + 10 * Math.floor(i / 10),
					],
					size: [8, 7],
					texture: "gui/icons.png",
					uv: [53, 1],
				}),
			);
		}

		// Add half-heart if health value is odd
		if (Player.health % 2) {
			UI.hud.add(
				new Component({
					name: `heart_inner_${i}`,
					origin: ["center", "bottom"],
					offset: [
						-UI.hud.components.hotbar.size[0] / 2 + 5 + 8 * (i % 10),
						31 + 10 * Math.floor(i / 10),
					],
					size: [8, 7],
					texture: "gui/icons.png",
					uv: [62, 1],
				}),
			);
		}
	},
	render_hunger = () => {
		// Hunger outlines
		for (let i = 0; i < Player.max_hunger / 2; i++) {
			UI.hud.add(
				new Component({
					name: `hunger_outline_${i}`,
					origin: ["center", "bottom"],
					offset: [
						UI.hud.components.hotbar.size[0] / 2 - 4.5 - 8 * (i % 10),
						30 + 10 * Math.floor(i / 10),
					],
					size: [9, 9],
					texture: "gui/icons.png",
					uv: [16, 27],
				}),
			);
		}

		// Hunger inners
		let i = 0;
		for (i; i < Math.floor(Player.hunger / 2); i++) {
			UI.hud.add(
				new Component({
					name: `hunger_inner_${i}`,
					origin: ["center", "bottom"],
					offset: [
						UI.hud.components.hotbar.size[0] / 2 - 4 - 8 * (i % 10),
						30 + 10 * Math.floor(i / 10),
					],
					size: [8, 9],
					texture: "gui/icons.png",
					uv: [53, 27],
				}),
			);
		}

		// Add half-hunger if hunger value is odd
		if (Player.hunger % 2) {
			UI.hud.add(
				new Component({
					name: `hunger_inner_${i}`,
					origin: ["center", "bottom"],
					offset: [
						UI.hud.components.hotbar.size[0] / 2 - 4 - 8 * (i % 10),
						30 + 10 * Math.floor(i / 10),
					],
					size: [8, 9],
					texture: "gui/icons.png",
					uv: [62, 27],
				}),
			);
		}
	},
	render_hotbar_selector = (prev_slot, next_slot) => {
		let hotbar = UI.hud.components.hotbar,
			selector = UI.hud.components.selector;

		// Clear the previous selected slot
		UI.hud.erase(selector);

		// Pre-calculate component size, offset & origin
		const
			size = [
				selector.w,
				selector.h,
			],
			offset = [
				selector.offset[0] * Settings.gui_scale,
				selector.offset[1] * Settings.gui_scale,
			],
			origin = [
				UI.hud.w / 2 - size[0] / 2 + offset[0],
				UI.hud.h - size[1] - offset[1],
			];

		// Re-draw the part of the hotbar where the selector was
		UI.hud.ctx.drawImage(
			UI.hud.loaded_textures[hotbar.texture],
			hotbar.uv[0] + (prev_slot * 20) - 1,
			hotbar.uv[1],
			selector.size[0],
			hotbar.size[1],
			origin[0],
			origin[1] + Settings.gui_scale,
			size[0],
			size[1] - Settings.gui_scale * 2,
		);

		selector.offset[0] = -80 + 20 * next_slot;

		// Compute and re-draw the selector on the new hotbar slot
		UI.hud
			.compute(selector)
			.draw(selector);

		return next_slot;
	},
	/**
	 * Draw a text component.
	 */
	print = c => {
		// Explode the text in lines
		const
			l = c.layer,
			lines = String(c.text).split("\n").map(t => Object({
				text: t,
				w: 0,
			}));

		let max_width = 0;

		// Calculate line widths
		for (let line of lines) {
			for (let char of line.text) {
				line.w += (Fetch.font.char_size[char] ?? 5) + 1;

				// Get the max possible line width
				if (line.w > max_width) max_width = line.w;
			}
		}

		// Update component size
		c.size[0] = (max_width + 2);
		c.size[1] = 9 * lines.length;

		l.compute(c);

		let y = c.y + Settings.gui_scale;

		for (let line of lines) {
			let x = c.x + Settings.gui_scale;

			for (let char of line.text) {
				let i = Fetch.font.chars.indexOf(char),
					u = i % 16 * 8,
					v = 8 * (Math.floor(i / 16) + 2);

				if (c.text_shadow) {
					l.ctx.globalAlpha = .245;

					// Draw text shadow
					l.ctx.drawImage(
						l.loaded_textures[c.texture],
						u,
						v,
						6,
						8,
						x + Settings.gui_scale, // Shadow offset
						y + Settings.gui_scale, // Shadow offset
						6 * Settings.gui_scale,
						8 * Settings.gui_scale,
					);
				}

				l.ctx.globalAlpha = 1;

				// Draw text value
				l.ctx.drawImage(
					l.loaded_textures[c.texture],
					u,
					v,
					6,
					8,
					x,
					y,
					6 * Settings.gui_scale,
					8 * Settings.gui_scale,
				);

				// Move the drawer 1 character to right
				x += ((Fetch.font.char_size[char] ?? 5) + 1) * Settings.gui_scale;
			}
			// Move the drawer 1 character to bottom
			y += 9 * Settings.gui_scale;
		}

		l.ctx.globalCompositeOperation = "source-atop";
		l.ctx.fillStyle = c.text_color;
		l.ctx.fillRect(
			c.x,
			c.y,
			c.w,
			c.h + (c.text_shadow && Settings.gui_scale),
		);

		if (c.text_background) {
			l.ctx.globalCompositeOperation = "destination-over";
			l.ctx.fillStyle = c.text_background;
			l.ctx.globalAlpha = c.text_background_alpha;
			l.ctx.fillRect(
				c.x,
				c.y,
				c.w,
				c.h + (c.text_shadow && Settings.gui_scale),
			);
		}

		// Reset composite operation and alpha values before drawing other components
		l.ctx.globalCompositeOperation = "source-over";
		l.ctx.globalAlpha = 1;
	},
	/**
	 * Generate scripts to get current JavaScript version.
	 */
	get_js_version = () => {
		for (let i = 1; i <= 9; i++) {
			// Create a new script
			let script = document.createElement("script");

			script.setAttribute("language", `javascript1.${i}`);
			script.textContent = `js = 1.${i}`;

			document.body.append(script);

			// Remove the script when the version is obtained
			script.remove();
		}

		return js;
	},
	/**
	 * Return 64 or 32 for the platform architecture.
	 */
	get_platform = () => {
		return (navigator.userAgent.includes("WOW64") || navigator.platform === "Win64") ? 64 : 32;
	},
	/**
	 * Return current frames per second.
	 */
	get_fps = () => {
		let time = performance.now();
		frame++;

		if (time - startTime > 1000) {
			UI.debug.components.debug_fps.text = `${(frame / ((time - startTime) / 1000)).toFixed(0)} fps`;
			UI.debug.redraw("debug_fps");

			startTime = time;
			frame = 0;
		}

		requestAnimationFrame(get_fps);
	};