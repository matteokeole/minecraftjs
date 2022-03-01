// Focus page event
addEventListener("click", () => {Controls.lock()});

// Press key event
addEventListener("keydown", e => {
	keys.push(e.code);
});

// Release key event
addEventListener("keyup", e => {
	const newKeys = [];
	keys.forEach(key => {
		if (key !== e.code) newKeys.push(key)
	});
	keys = newKeys
});

// Resize window event
addEventListener("resize", () => {
	Renderer.setSize(window.innerWidth, window.innerHeight);
	Camera.aspect = window.innerWidth / window.innerHeight;
	Camera.updateProjectionMatrix()
});

// Switch selected item (wheel event)
addEventListener("wheel", e => {
	if (e.deltaY > 0) {
		// Right
		selected_slot = (selected_slot < 8) ? ++selected_slot : 0;
	} else {
		// Left
		selected_slot = (selected_slot > 0) ? --selected_slot : 8;
	}
	inventory_bar_selector.updateX(inventory_bar_selector_slots[selected_slot]);
});