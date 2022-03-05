const
	holdBlockMaterial = ([
		"spruce_planks",	// Right
		"spruce_planks",	// Left
		"spruce_planks",	// Top
		"spruce_planks",	// Bottom
		"spruce_planks",	// Front
		"spruce_planks",	// Back
	]).map(face => {
		const map = Loader.load(`assets/textures/block/${face}.png`);
		map.magFilter = THREE.NearestFilter;
		return new THREE.MeshBasicMaterial({map: map});
	}),
	holdBlock = new THREE.Mesh(new THREE.BoxGeometry(1.04, 1.04, 1.04), holdBlockMaterial);

// Set hold block position
holdBlock.position.set(1.46, -1.28, -1.88);

// Set hold block rotation
holdBlock.rotation.set(
	0,
	Math.PI / (Math.PI + 1) + .028,
	0,
);

Camera.add(holdBlock);