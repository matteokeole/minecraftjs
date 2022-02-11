const render = () => {
	// Attach raycaster to the current camera
	Raycaster.setFromCamera(Pointer, Camera);

	let intersection = Raycaster.intersectObject(instancedChunk);

	// Check if the raycast intersects with something near
	if (intersection[0] !== undefined && intersection[0].distance < 40) {
		let pos = intersection[0].point,
		materialIndex = intersection[0].face.materialIndex,
		x = Math.round(pos.x / u) * u,
		y = Math.round(pos.y / u) * u,
		z = Math.round(pos.z / u) * u,
		inc = -(u / 2);

		// Update selector position
		switch (materialIndex) {
			case 0:
				// Right
				x = pos.x + inc;
				break;
			case 1:
				// Left
				x = pos.x - inc;
				break;
			case 2:
				// Top
				y = pos.y + inc;
				break;
			case 3:
				// Bottom
				y = pos.y - inc;
				break;
			case 4:
				// Front
				z = pos.z + inc;
				break;
			case 5:
				// Back
				z = pos.z - inc;
				break
		}
		Selector.position.x = x;
		Selector.position.y = y;
		Selector.position.z = z
	}

	// Render the scene
	Renderer.render(Scene, Camera)
}