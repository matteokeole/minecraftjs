// Focus page event
addEventListener("click", () => {
	if (!ContainerLayer.visible) Controls.lock();
});

// Press key event
addEventListener("keydown", e => {
	if (!/^(ControlLeft|F.+)$/.test(e.code)) e.preventDefault();
	keys.push(e.code);
});

// Release key event
addEventListener("keyup", e => {
	const newKeys = [];
	keys.forEach(key => {
		if (key !== e.code) newKeys.push(key);
	});
	keys = newKeys;
});

// Resize window event
addEventListener("resize", () => {
	WINDOW_WIDTH = window.innerWidth;
	WINDOW_HEIGHT = window.innerHeight;
	Renderer.setSize(WINDOW_WIDTH, WINDOW_HEIGHT);
	Camera.aspect = WINDOW_WIDTH / WINDOW_HEIGHT;
	Camera.updateProjectionMatrix();
});

// Switch selected item (wheel event)
let selected_slot = 0;
addEventListener("wheel", e => {
	if (e.deltaY > 0) {
		// Right
		selected_slot = (selected_slot < 8) ? ++selected_slot : 0;
	} else {
		// Left
		selected_slot = (selected_slot > 0) ? --selected_slot : 8;
	}

	SelectorLayer.components.get("hotbar_selector").setPosition([
		-160 + selected_slot * 40,
		SelectorLayer.components.get("hotbar_selector").origin.y,
	]);
	SelectorLayer.update();
});