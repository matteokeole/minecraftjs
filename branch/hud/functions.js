import {Player} from "./variables.js";
import {Component} from "./component.js";

export const
	renderHealth = layer => {
		// Heart outlines
		for (let i = 0; i < Player.maxHealth / 2; i++) {
			layer.add(
					new Component({
						name: `heart_outline_${i}`,
						origin: [
							() => -86.5 * layer.scale + (i % 10) * 8 * layer.scale,
							() => -window.innerHeight / 2 + Math.floor(i / 10) * 20 + 35 * layer.scale,
						],
						size: [
							() => 9 * layer.scale,
							() => 9 * layer.scale,
						],
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
							origin: [
								() => -86 * layer.scale + (i / 2 % 10) * 8 * layer.scale,
								() => -(window.innerHeight / 2) + Math.floor(j / 10) * 20 + 35 * layer.scale,
							],
							size: [
								() => 8 * layer.scale,
								() => 7 * layer.scale,
							],
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
							origin: [
								() => -86 * layer.scale + (i / 2 % 10) * 8 * layer.scale,
								() => -window.innerHeight / 2 + Math.floor(j / 10) * 20 + 35 * layer.scale,
							],
							size: [
								() => 8 * layer.scale,
								() => 7 * layer.scale,
							],
							texture: "gui/icons.png",
							uv: [53, 1],
						}),
					);
			}
		}
	},
	renderHunger = layer => {
		// Hunger outlines
		for (let i = 0; i < Player.maxHunger / 2; i++) {
			layer.add(
					new Component({
						name: `hunger_outline_${i}`,
						origin: [
							() => 86.5 * layer.scale - (i % 10) * 8 * layer.scale,
							() => -window.innerHeight / 2 + Math.floor(i / 10) * 20 + 35 * layer.scale,
						],
						size: [
							() => 9 * layer.scale,
							() => 9 * layer.scale,
						],
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
							origin: [
								() => 87 * layer.scale - (i / 2 % 10) * 8 * layer.scale,
								() => -window.innerHeight / 2 + Math.floor(j / 10) * 20 + 35 * layer.scale,
							],
							size: [
								() => 8 * layer.scale,
								() => 9 * layer.scale,
							],
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
							origin: [
								() => 87 * layer.scale - (i / 2 % 10) * 8 * layer.scale,
								() => -window.innerHeight / 2 + Math.floor(j / 10) * 20 + 35 * layer.scale,
							],
							size: [
								() => 8 * layer.scale,
								() => 9 * layer.scale,
							],
							texture: "gui/icons.png",
							uv: [53, 27],
						}),
					);
			}
		}
	};