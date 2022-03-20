import {Settings, Player} from "./variables.js";
import {Component} from "./class/Component.js";
import {UI, Fetch} from "./main.js";

let startTime = performance.now(),
	frame = 0;

export const
	update_layers = () => {
		for (let layer of Object.values(UI)) {
			layer.update();
		}
	},
	render_health = () => {
		// Heart outlines
		for (let i = 0; i < Player.max_health / 2; i++) {
			UI.hud.add(
					new Component({
						name: `heart_outline_${i}`,
						origin: ["center", "bottom"],
						offset: [-UI.hud.components.hotbar.size.x / 2 + 4.5 + 8 * i, 30],
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
				UI.hud.add(
						new Component({
							name: `heart_inner_${j}`,
							origin: ["center", "bottom"],
							offset: [-UI.hud.components.hotbar.size.x / 2 + 5 + 4 * i, 31],
							size: [8, 7],
							texture: "gui/icons.png",
							uv: [62, 1],
						}),
					);
				break;
			}
			else if (i % 2 === 0) {
				j = i / 2;
				UI.hud.add(
						new Component({
							name: `heart_inner_${j}`,
							origin: ["center", "bottom"],
							offset: [-UI.hud.components.hotbar.size.x / 2 + 5 + 4 * i, 31],
							size: [8, 7],
							texture: "gui/icons.png",
							uv: [53, 1],
						}),
					);
			}
		}
	},
	render_hunger = () => {
		// Hunger outlines
		for (let i = 0; i < Player.max_hunger / 2; i++) {
			UI.hud.add(
					new Component({
						name: `hunger_outline_${i}`,
						origin: ["center", "bottom"],
						offset: [UI.hud.components.hotbar.size.x / 2 - 4.5 - 8 * i, 30],
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
				UI.hud.add(
						new Component({
							name: `hunger_inner_${j}`,
							origin: ["center", "bottom"],
							offset: [UI.hud.components.hotbar.size.x / 2 - 4 - 4 * i, 30],
							size: [8, 9],
							texture: "gui/icons.png",
							uv: [62, 27],
						}),
					);
			}
			else if (i % 2 === 0) {
				j = i / 2;
				UI.hud.add(
						new Component({
							name: `hunger_inner_${j}`,
							origin: ["center", "bottom"],
							offset: [UI.hud.components.hotbar.size.x / 2 - 4 - 4 * i, 30],
							size: [8, 9],
							texture: "gui/icons.png",
							uv: [53, 27],
						}),
					);
			}
		}
	},
	render_hotbar_selector = (prev_slot, new_slot) => {
		let hotbar = UI.hud.components.hotbar,
			selector = UI.hud.components.selector;

		// Clear the previous selected slot
		UI.hud.erase(selector);

		// Pre-calculate component size, offset & origin
		const
			size = {
				x: selector.size.x * UI.hud.scale,
				y: selector.size.y * UI.hud.scale,
			},
			offset = {
				x: selector.offset.x * UI.hud.scale,
				y: selector.offset.y * UI.hud.scale,
			},
			origin = {
				x: UI.hud.size.x / 2 - size.x / 2 + offset.x,
				y: UI.hud.size.y - size.y - offset.y,
			};

		// Re-draw the part of the hotbar where the selector was
		UI.hud.ctx.drawImage(
			UI.hud.loaded_textures[hotbar.texture],
			hotbar.uv.x + (prev_slot * 20) - 1,
			hotbar.uv.y,
			selector.size.x,
			hotbar.size.y,
			origin.x,
			origin.y + UI.hud.scale,
			size.x,
			size.y - UI.hud.scale * 2,
		);

		selector.offset.x = -80 + 20 * new_slot;

		// Re-draw the selector on the new hotbar slot
		UI.hud.draw(selector);

		return new_slot;
	},
	get_auto_scale = () => {
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
			c.size.x = (max_width + 2) * l.scale;
			c.size.y = 9 * lines.length * l.scale;

			// Pre-calculate component origin
			for (let a of ["x", "y"]) {
				switch (c.origin[a]) {
					// Top and left cases are set by default
					case "bottom":
					case "right":
						origin[a] = l.size[a] - c.size[a] - offset[a];
						break;
					case "center":
						origin[a] = l.size[a] / 2 - c.size[a] / 2 + offset[a];
						break;
				}
			}

			let y = origin.y + l.scale;

			for (let line of lines) {
				let x = origin.x + l.scale;

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
							x + l.scale, // Shadow offset
							y + l.scale, // Shadow offset
							6 * l.scale,
							8 * l.scale,
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
						6 * l.scale,
						8 * l.scale,
					);

					// Move the drawer 1 character to right
					x += ((Fetch.font.char_size[char] ?? 5) + 1) * l.scale;
				}
				// Move the drawer 1 character to bottom
				y += 9 * l.scale;
			}

			l.ctx.globalCompositeOperation = "source-atop";
			l.ctx.fillStyle = c.text_color;
			l.ctx.fillRect(
				origin.x,
				origin.y,
				c.size.x,
				c.size.y + (c.text_shadow && l.scale),
			);

			if (c.text_background) {
				l.ctx.globalCompositeOperation = "destination-over";
				l.ctx.fillStyle = c.text_background;
				l.ctx.globalAlpha = c.text_background_alpha;
				l.ctx.fillRect(
					origin.x,
					origin.y,
					c.size.x,
					c.size.y + (c.text_shadow && l.scale),
				);
			}

			// Reset composite operation and alpha values before drawing other components
			l.ctx.globalCompositeOperation = "source-over";
			l.ctx.globalAlpha = 1;
		} else {
			// Draw component
			l.ctx.drawImage(
				l.loaded_textures[c.texture],
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

		// Clear the area where is located the component
		l.ctx.clearRect(
			origin.x,
			origin.y,
			size.x,
			size.y + l.scale,
		);
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
			UI.debug.redraw(UI.debug.components.debug_fps);

			startTime = time;
			frame = 0;
		}

		requestAnimationFrame(get_fps);
	};