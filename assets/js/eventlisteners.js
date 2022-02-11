// Focus page event
addEventListener("click", () => {Controls.lock()});

// Press key event
addEventListener("keydown", e => {
	keys.push(e.code);
	if (e.code === "Space" && canJump) {
		canJump = false;
		ySpeed = -1
	}
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