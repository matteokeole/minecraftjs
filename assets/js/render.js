const render = () => {
	// Attach raycaster to the current camera
	Raycaster.setFromCamera(Pointer, Camera);

	let intersection = Raycaster.intersectObject(instancedChunk);

	// Check if the raycast intersects with something near
	if (intersection[0] !== undefined && intersection[0].distance < 40) {
		let pos = intersection[0].point,
			// materialIndex = intersection[0].face.materialIndex,
			x = Math.round(pos.x / u) * u,
			y = Math.round(pos.y / u) * u - u,
			z = Math.round(pos.z / u) * u;

		// Set selector position
		Selector.position.x = x;
		Selector.position.y = y;
		Selector.position.z = z
	}

	// Render the scene
	Renderer.render(Scene, Camera)
}