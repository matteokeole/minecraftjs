// Set random Perlin noise seed for the terrain generation
noise.seed(Math.random());

const Scene = new THREE.Scene(),
Renderer = new THREE.WebGLRenderer(),
Camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, .1, 1000),
Loader = new THREE.TextureLoader(),
Controls = new THREE.PointerLockControls(Camera, document.body),
stats = new Stats(),
BlockGeometry = new THREE.BoxGeometry(5, 5, 5),
BlockMaterial = [
	new THREE.MeshBasicMaterial({map: Loader.load("assets/textures/block/podzol_side.png")}),
	new THREE.MeshBasicMaterial({map: Loader.load("assets/textures/block/podzol_side.png")}),
	new THREE.MeshBasicMaterial({map: Loader.load("assets/textures/block/podzol_top.png")}),
	new THREE.MeshBasicMaterial({map: Loader.load("assets/textures/block/dirt.png")}),
	new THREE.MeshBasicMaterial({map: Loader.load("assets/textures/block/podzol_side.png")}),
	new THREE.MeshBasicMaterial({map: Loader.load("assets/textures/block/podzol_side.png")})
],
Faces = [
	{dir: [-5,  0,  0, "left"]},
	{dir: [ 5,  0,  0, "right"]},
	{dir: [ 0, -5,  0, "bottom"]},
	{dir: [ 0,  5,  0, "top"]},
	{dir: [ 0,  0, -5, "back"]},
	{dir: [ 0,  0,  5, "front"]}
],
Block = function(x, y, z) {
	// Block constructor
	this.x = x;
	this.y = y;
	this.z = z;
	this.mesh;
	this.line;
	this.getVoxel = function(x, y, z) {
		let response = false;
		chunks.forEach(chunk => {
			chunk.forEach(block => {
				if (
					block.x == x &&
					block.y == y &&
					block.z == z
				) response = true
			})
		});
		return response
	};
	this.directions = [];
	this.adjustFaces = function() {
		for (const {dir} of Faces) {
			const neighbor = this.getVoxel(
				this.x + dir[0],
				this.y + dir[1],
				this.z + dir[2]
			);
			if (neighbor) this.directions.push(dir[3])
		}
	};
	this.display = function() {
		// Remove unwanted faces
		this.adjustFaces();

		// Create block
		this.mesh = new THREE.Mesh(BlockGeometry, [
			(this.directions.includes("right") ? null : BlockMaterial[0]),
			(this.directions.includes("left") ? null : BlockMaterial[1]),
			(this.directions.includes("top") ? null : BlockMaterial[2]),
			(this.directions.includes("bottom") ? null : BlockMaterial[3]),
			(this.directions.includes("front") ? null : BlockMaterial[4]),
			(this.directions.includes("back") ? null : BlockMaterial[5])
		]);
		this.mesh.position.x = this.x;
		this.mesh.position.y = this.y - 10;
		this.mesh.position.z = this.z;
		Scene.add(this.mesh);

		// Create block borders
		const BlockEdges = new THREE.EdgesGeometry(BlockGeometry);
		this.line = new THREE.LineSegments(BlockEdges, new THREE.LineBasicMaterial({color: 0xffff00}));
		// Scene.add(this.line);
		this.line.position.x = this.x;
		this.line.position.y = this.y - 10;
		this.line.position.z = this.z
	}
},
getBlock = (pos, axis) => {
	const map = [];
	chunks.forEach(chunk => {
		chunk.forEach(block => {
			map.push(block[axis])
		})
	});
	return pos === "lowest" ? Math.min.apply(null, map) : Math.max.apply(null, map)
},
render = () => {Renderer.render(Scene, Camera)},
loop = () => {
	requestAnimationFrame(loop);
	update();
	render()
},
update = () => {
	// Player movement
	if (keys.includes("z")) Controls.moveForward(movingSpeed);
	if (keys.includes("q")) Controls.moveRight(-movingSpeed);
	if (keys.includes("s")) Controls.moveForward(-movingSpeed);
	if (keys.includes("d")) Controls.moveRight(movingSpeed);

	// Jump function
	if (!Settings.autojump) {
		chunks.forEach(chunk => {
			chunk.forEach(block => {
				if (
					Camera.position.x <= block.x + 2.5 &&
					Camera.position.x >= block.x - 2.5 &&
					Camera.position.y == block.y - 2.5 &&
					Camera.position.z <= block.z + 2.5 &&
					Camera.position.z >= block.z - 2.5
				) {
					switch (true) {
						case keys.includes("z"):
							// Forward key
							Controls.moveForward(-movingSpeed);
							break;
						case keys.includes("q"):
							// Left key
							Controls.moveRight(movingSpeed);
							break;
						case keys.includes("s"):
							// Backward key
							Controls.moveForward(movingSpeed);
							break;
						case keys.includes("d"):
							// Right key
							Controls.moveRight(-movingSpeed);
							break
					}
				}
			})
		})
	}

	Camera.position.y -= ySpeed;
	ySpeed += acc;

	// Player gravity
	chunks.forEach(chunk => {
		chunk.forEach(block => {
			if (
				Camera.position.x <= block.x + 2.5 &&
				Camera.position.x >= block.x - 2.5 &&
				Camera.position.y <= block.y + 10 &&
				Camera.position.y >= block.y &&
				Camera.position.z <= block.z + 2.5 &&
				Camera.position.z >= block.z - 2.5
			) {
				Camera.position.y = block.y + 10;
				ySpeed = 0;
				canJump = true
			}
		})
	});

	// Terrain generation
	if (Camera.position.z <= getBlock("lowest", "z") + 20) {
		/*
			[0], [3], [6],
			[1], [x], [7],
			[2], [5], [8]
		*/

		// Remove chunks behind the player

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
				let x = lowestX + (i * chunkSize * 5);
				x < lowestX + ((i + 1) * chunkSize * 5);
				x += 5
			) {
				for (
					let z = lowestZ - (chunkSize * 5);
					z < lowestZ;
					z += 5
				) {
					xOff = inc * x / 5;
					zOff = inc * z / 5;
					const v = Math.round(noise.perlin2(xOff, zOff) * amplitude / 5) * 5;
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

	if (Camera.position.z >= getBlock("highest", "z") - 20) {
		/*
			[0], [3], [6],
			[1], [x], [7],
			[2], [5], [8]
		*/

		// Remove chunks behind the player

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
				let x = lowestX + (i * chunkSize * 5);
				x < lowestX + ((i + 1) * chunkSize * 5);
				x += 5
			) {
				for (
					let z = highestZ + 5;
					z < (highestZ + 5) + (chunkSize * 5);
					z += 5
				) {
					xOff = inc * x / 5;
					zOff = inc * z / 5;
					const v = Math.round(noise.perlin2(xOff, zOff) * amplitude / 5) * 5;
					chunk.push(new Block(x, v, z))
				}
			}
			newChunks.splice((i * renderDistance) + 2, 0, chunk)
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

	if (Camera.position.x >= getBlock("highest", "x") - 20) {
		/*
			[0], [3], [6],
			[1], [x], [7],
			[2], [5], [8]
		*/

		// Remove chunks behind the player

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
				let z = lowestZ + (i * chunkSize * 5);
				z < lowestZ + ((i + 1) * chunkSize * 5);
				z += 5
			) {
				for (
					let x = highestX + 5;
					x < highestX + 5 + (chunkSize * 5);
					x += 5
				) {
					xOff = inc * x / 5;
					zOff = inc * z / 5;
					const v = Math.round(noise.perlin2(xOff, zOff) * amplitude / 5) * 5;
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

	if (Camera.position.x <= getBlock("lowest", "x") + 20) {
		/*
			[0], [3], [6],
			[1], [x], [7],
			[2], [5], [8]
		*/

		// Remove chunks behind the player

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
				let z = lowestZ + (i * chunkSize * 5);
				z < lowestZ + ((i + 1) * chunkSize * 5);
				z += 5
			) {
				for (
					let x = lowestX - (chunkSize * 5);
					x < lowestX;
					x += 5
				) {
					xOff = inc * x / 5;
					zOff = inc * z / 5;
					const v = Math.round(noise.perlin2(xOff, zOff) * amplitude / 5) * 5;
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
},
animate = () => {
	stats.begin();
	//
	stats.end();
	requestAnimationFrame(animate)
};

let // Generation variables
	amplitude = 30 + (Math.random() * 70),
	inc = .05,
	// Chunks and render distance variables
	chunks = [],
	chunkSize = 6,
	renderDistance = 3,
	// Movement variables
	keys = [],
	movingSpeed = .5,
	acc = .065,
	ySpeed = 0,
	canJump = true,
	// Player settings
	Settings = {autojump: false};

// Show stats panel
// 0 - fps
// 1 - ms
// 2 - mb
// 3+ - custom
stats.showPanel(0);
document.body.appendChild(stats.dom);

// Set scene background color and fog
// Scene.background = new THREE.Color(0x282923);
Scene.fog = new THREE.Fog(0x000000, 10, 100);

// Pixelise block faces
BlockMaterial.forEach(face => {face.map.magFilter = THREE.NearestFilter});

// Set renderer size
Renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(Renderer.domElement);

// Event listeners
addEventListener("click", () => {
	// Focus page event
	Controls.lock()
});
addEventListener("keydown", e => {
	// Press key event
	keys.push(e.key);
	if (e.key === " " && canJump) {
		canJump = false;
		ySpeed = -1
	}
});
addEventListener("keyup", e => {
	// Release key event
	const newKeys = [];
	for (let i in keys) {
		if (keys[i] !== e.key) newKeys.push(keys[i])
	}
	keys = newKeys
});
addEventListener("resize", () => {
	// Resize window event
	Renderer.setSize(window.innerWidth, window.innerHeight);
	Camera.aspect = window.innerWidth / window.innerHeight;
	Camera.updateProjectionMatrix()
});

// Set camera position
Camera.position.x = renderDistance * chunkSize / 2 * 5;
Camera.position.z = renderDistance * chunkSize / 2 * 5;
Camera.position.y = 50;

// Generate chunks 
let instancedChunk = new THREE.InstancedMesh(
	BlockGeometry,
	BlockMaterial,
	(chunkSize * chunkSize * renderDistance * renderDistance)
),
count = 0;
for (let i = 0; i < renderDistance; i++) {
	for (let j = 0; j < renderDistance; j++) {
		let chunk = [];
		for (
			let x = (i * chunkSize);
			x < (i * chunkSize) + chunkSize;
			x++
		) {
			for (
				let z = (j * chunkSize);
				z < (j * chunkSize) + chunkSize;
				z++
			) {
				xOff = inc * x;
				zOff = inc * z;
				const v = Math.round(noise.perlin2(xOff, zOff) * amplitude / 5) * 5;
				chunk.push(new Block(x * 5, v, z * 5));
				let matrix = new THREE.Matrix4().makeTranslation(x * 5, v, z * 5);
				instancedChunk.setMatrixAt(count, matrix);
				count++
			}
		}
		chunks.push(chunk)
	}
}

Scene.add(instancedChunk);

// Loop rendering and stats function
loop();
requestAnimationFrame(animate)