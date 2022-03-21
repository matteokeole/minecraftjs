import {Layer} from "./layer.js";
import {Component} from "./component.js";

export const
	WINDOW = {
		WIDTH: window.innerWidth,
		HEIGHT: window.innerHeight,
		MAX_WIDTH: window.screen.width,
		MAX_HEIGHT: window.screen.height,
	},
	LOADED_TEXTURES = {},
	layers = document.createDocumentFragment(),
	hud = new Layer({
		name: "hud",
		components: {
			hotbar: new Component({
				origin: ["center", "bottom"],
				offset: [0, 0],
				size: [182, 22],
				texture: "gui/widgets.png",
				uv: [0, 0],
			}),
		},
	});

export let gui_scale = 2;

hud.update();

document.body.appendChild(layers);

addEventListener("resize", () => {
	WINDOW.WIDTH = window.innerWidth;
	WINDOW.HEIGHT = window.innerHeight;
	hud.resize().redraw();
});