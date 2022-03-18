import {Interface} from "./main.js";
import {getAutoScale} from "./functions.js";

addEventListener("contextmenu", e => e.preventDefault());

addEventListener("resize", () => {
	Interface.container
		.setScale(getAutoScale())
		.update();
});