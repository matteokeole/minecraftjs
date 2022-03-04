const update = () => {
	// Player movement
	if (keys.includes(Keybinds.walk_forwards)) Controls.moveForward(movingSpeed);
	if (keys.includes(Keybinds.strafe_left)) Controls.moveRight(-movingSpeed);
	if (keys.includes(Keybinds.walk_backwards)) Controls.moveForward(-movingSpeed);
	if (keys.includes(Keybinds.strafe_right)) Controls.moveRight(movingSpeed);

	// Hotbar slot keybinds
	for (let i in Keybinds.hotbar_slots) {
		if (keys.includes(Keybinds.hotbar_slots[i])) {
			keys.splice(i, 1);
			selected_slot = i;
			SelectorLayer.components.get("hotbar_selector").setPosition([
				-160 + selected_slot * 40,
				SelectorLayer.components.get("hotbar_selector").origin.y,
			]);
			SelectorLayer.update();
		}
	}

	if (keys.includes(Keybinds.jump) && canJump) {
		canJump = false;
		ySpeed = -1
	}

	if (keys.includes(Keybinds.open_inventory)) {
		keys.splice(keys.indexOf("KeyI"), 1);
		inventoryOpened = !inventoryOpened;
		if (inventoryOpened) Camera.enableRotate = false;
		else Camera.enableRotate = true;
		UIContainerLayer.setVisibility(inventoryOpened);
	}

	Camera.position.y -= ySpeed / 4;
	ySpeed += acc;

	// Player gravity
	chunks.forEach(chunk => {
		chunk.forEach(block => {
			if (
				Camera.position.x <= block.x + (u / 2) &&
				Camera.position.x >= block.x - (u / 2) &&
				Camera.position.y <= block.y + (u * 2.12) &&
				Camera.position.y >= block.y &&
				Camera.position.z <= block.z + (u / 2) &&
				Camera.position.z >= block.z - (u / 2)
			) {
				Camera.position.y = block.y + (u * 2.12);
				ySpeed = 0;
				canJump = true
			}
		})
	});

	// Terrain generation
	const worldWide = chunkSize * renderDistance * u,
		ratio = .4;
	if (Camera.position.z <= getBlock("lowest", "z") + (worldWide * ratio)) {
		/*
			[0], [3], [6]
			[1], [x], [7]
			[2], [5], [8]
		*/

		let newChunks = [];

		// Add new chunks in front of the player
		for (let i in chunks) {
			if ((i + 1) % renderDistance != 0) {
				newChunks.push(chunks[i])
			}
		}

		// Add blocks
		let lowestX = getBlock("lowest", "x"),
			lowestZ = getBlock("lowest", "z");
		for (let i = 0; i < renderDistance; i++) {
			let chunk = [];
			for (
				let x = lowestX + (i * chunkSize * u);
				x < lowestX + ((i + 1) * chunkSize * u);
				x += u
			) {
				for (
					let z = lowestZ - (chunkSize * u);
					z < lowestZ;
					z += u
				) {
					xOff = inc * x / u;
					zOff = inc * z / u;
					const v = Math.round(noise.perlin2(xOff, zOff) * amplitude / u) * u;
					chunk.push(new Block(x, v, z))
				}
			}
			newChunks.splice(i * renderDistance, 0, chunk)
		}

		chunks = newChunks;

		Scene.remove(instancedChunk)

		instancedChunk = new THREE.InstancedMesh(
			BlockGeometry,
			BlockMaterial,
			(chunkSize * chunkSize * renderDistance * renderDistance)
		);
		let count = 0;
		chunks.forEach(chunk => {
			chunk.forEach(block => {
				let matrix = new THREE.Matrix4().makeTranslation(
					block.x,
					block.y,
					block.z
				);
				instancedChunk.setMatrixAt(count, matrix);
				count++
			})
		});
		Scene.add(instancedChunk)
	}

	if (Camera.position.z >= getBlock("highest", "z") - (worldWide * ratio)) {
		/*
			[0], [3], [6]
			[1], [x], [7]
			[2], [5], [8]
		*/

		let newChunks = [];

		// Add new chunks in front of the player
		for (let i in chunks) {
			if (i % renderDistance != 0) {
				newChunks.push(chunks[i])
			}
		}

		// Add blocks
		let lowestX = getBlock("lowest", "x"),
			highestZ = getBlock("highest", "z");
		for (let i = 0; i < renderDistance; i++) {
			let chunk = [];
			for (
				let x = lowestX + (i * chunkSize * u);
				x < lowestX + ((i + 1) * chunkSize * u);
				x += u
			) {
				for (
					let z = highestZ + u;
					z < (highestZ + u) + (chunkSize * u);
					z += u
				) {
					xOff = inc * x / u;
					zOff = inc * z / u;
					const v = Math.round(noise.perlin2(xOff, zOff) * amplitude / u) * u;
					chunk.push(new Block(x, v, z))
				}
			}
			newChunks.splice((i + 1) * renderDistance - 1, 0, chunk)
		}

		chunks = newChunks;

		Scene.remove(instancedChunk)

		instancedChunk = new THREE.InstancedMesh(
			BlockGeometry,
			BlockMaterial,
			(chunkSize * chunkSize * renderDistance * renderDistance)
		);
		let count = 0;
		chunks.forEach(chunk => {
			chunk.forEach(block => {
				let matrix = new THREE.Matrix4().makeTranslation(
					block.x,
					block.y,
					block.z
				);
				instancedChunk.setMatrixAt(count, matrix);
				count++
			})
		});
		Scene.add(instancedChunk)
	}

	if (Camera.position.x >= getBlock("highest", "x") - (worldWide * ratio)) {
		/*
			[0], [3], [6]
			[1], [x], [7]
			[2], [5], [8]
		*/

		let newChunks = [];

		// Add new chunks in front of the player
		for (let i = renderDistance; i < chunks.length; i++) {
			newChunks.push(chunks[i])
		}

		// Add blocks
		let highestX = getBlock("highest", "x"),
			lowestZ = getBlock("lowest", "z");
		for (let i = 0; i < renderDistance; i++) {
			let chunk = [];
			for (
				let z = lowestZ + (i * chunkSize * u);
				z < lowestZ + ((i + 1) * chunkSize * u);
				z += u
			) {
				for (
					let x = highestX + u;
					x < highestX + u + (chunkSize * u);
					x += u
				) {
					xOff = inc * x / u;
					zOff = inc * z / u;
					const v = Math.round(noise.perlin2(xOff, zOff) * amplitude / u) * u;
					chunk.push(new Block(x, v, z))
				}
			}
			newChunks.splice(chunks.length - (renderDistance - i), 0, chunk)
		}

		chunks = newChunks;

		Scene.remove(instancedChunk)

		instancedChunk = new THREE.InstancedMesh(
			BlockGeometry,
			BlockMaterial,
			(chunkSize * chunkSize * renderDistance * renderDistance)
		);
		let count = 0;
		chunks.forEach(chunk => {
			chunk.forEach(block => {
				let matrix = new THREE.Matrix4().makeTranslation(
					block.x,
					block.y,
					block.z
				);
				instancedChunk.setMatrixAt(count, matrix);
				count++
			})
		});
		Scene.add(instancedChunk)
	}

	if (Camera.position.x <= getBlock("lowest", "x") + (worldWide * ratio)) {
		/*
			[0], [3], [6]
			[1], [x], [7]
			[2], [5], [8]
		*/

		let newChunks = [];

		// Add new chunks in front of the player
		for (let i = 0; i < chunks.length - renderDistance; i++) {
			newChunks.push(chunks[i])
		}

		// Add blocks
		let lowestX = getBlock("lowest", "x"),
			lowestZ = getBlock("lowest", "z");
		for (let i = 0; i < renderDistance; i++) {
			let chunk = [];
			for (
				let z = lowestZ + (i * chunkSize * u);
				z < lowestZ + ((i + 1) * chunkSize * u);
				z += u
			) {
				for (
					let x = lowestX - (chunkSize * u);
					x < lowestX;
					x += u
				) {
					xOff = inc * x / u;
					zOff = inc * z / u;
					const v = Math.round(noise.perlin2(xOff, zOff) * amplitude / u) * u;
					chunk.push(new Block(x, v, z))
				}
			}
			newChunks.splice(i, 0, chunk)
		}

		chunks = newChunks;

		Scene.remove(instancedChunk)

		instancedChunk = new THREE.InstancedMesh(
			BlockGeometry,
			BlockMaterial,
			(chunkSize * chunkSize * renderDistance * renderDistance)
		);
		let count = 0;
		chunks.forEach(chunk => {
			chunk.forEach(block => {
				let matrix = new THREE.Matrix4().makeTranslation(
					block.x,
					block.y,
					block.z
				);
				instancedChunk.setMatrixAt(count, matrix);
				count++
			})
		});
		Scene.add(instancedChunk)
	}
}