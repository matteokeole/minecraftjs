// Set random Perlin noise seed for the terrain generation
noise.seed(Math.random());

const Scene = new THREE.Scene(),
Renderer = new THREE.WebGLRenderer(),
Camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, .1, 1000),
Loader = new THREE.TextureLoader(),
Controls = new THREE.PointerLockControls(Camera, document.body),
BlockGeometry = new THREE.BoxGeometry(5, 5, 5),
BlockMaterial = [
	new THREE.MeshBasicMaterial({map: Loader.load("assets/textures/block/podzol_side.png")}),
	new THREE.MeshBasicMaterial({map: Loader.load("assets/textures/block/podzol_side.png")}),
	new THREE.MeshBasicMaterial({map: Loader.load("assets/textures/block/podzol_top.png")}),
	new THREE.MeshBasicMaterial({map: Loader.load("assets/textures/block/dirt.png")}),
	new THREE.MeshBasicMaterial({map: Loader.load("assets/textures/block/podzol_side.png")}),
	new THREE.MeshBasicMaterial({map: Loader.load("assets/textures/block/podzol_side.png")})
],
Block = function(x, y, z) {
	// Block constructor
	this.x = x;
	this.y = y;
	this.z = z;
	this.mesh;
	this.display = function() {
		BlockMaterial.forEach(face => {
			// Pixelise faces
			face.map.magFilter = THREE.NearestFilter
		});
		this.mesh = new THREE.Mesh(BlockGeometry, BlockMaterial);
		Scene.add(this.mesh);
		this.mesh.position.x = this.x;
		this.mesh.position.y = this.y - 10;
		this.mesh.position.z = this.z
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
	switch (true) {
		case keys.includes("z"):
			// Forward key
			Controls.moveForward(movingSpeed);
			break;
		case keys.includes("q"):
			// Left key
			Controls.moveRight(-movingSpeed);
			break;
		case keys.includes("s"):
			// Backward key
			Controls.moveForward(-movingSpeed);
			break;
		case keys.includes("d"):
			// Right key
			Controls.moveRight(movingSpeed);
			break
	}

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
				Camera.position.y <= block.y + 2.5 &&
				Camera.position.y >= block.y - 2.5 &&
				Camera.position.z <= block.z + 2.5 &&
				Camera.position.z >= block.z - 2.5
			) {
				Camera.position.y = block.y + 2.5;
				ySpeed = 0;
				canJump = true
			}
		})
	});

	// Terrain generation
	if (Camera.position.z <= getBlock("lowest", "z") + 15) {
		/*
			[0], [3], [6],
			[1], [x], [7],
			[2], [5], [8]
		*/

		// Remove chunks behind the player
		for (let i in chunks) {
			if ((i + 1) % renderDistance == 0) {
				chunks[i].forEach(block => {Scene.remove(block.mesh)})
			}
		}

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
					chunk.push(new Block(
						x,
						Math.round(noise.perlin2(xOff, zOff) * amplitude / 5) * 5,
						z
					))
				}
			}
			newChunks.splice(i * renderDistance, 0, chunk)
		}

		chunks = newChunks;

		// Display chunks
		for (let i in chunks) {
			if (i % renderDistance == 0) {
				chunks[i].forEach(block => {block.display()})
			}
		}
	}
};

let // Generation variables
	amplitude = 30 + (Math.random() * 70),
	inc = .05,
	// Chunks and render distance variables
	chunks = [],
	chunkSize = 3,
	renderDistance = 3,
	// Movement variables
	keys = [],
	movingSpeed = .5,
	acc = .065,
	ySpeed = 0,
	canJump = true,
	// Player settings
	Settings = {autojump: false};

// Set scene background color
Scene.background = new THREE.Color(0x282923);

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

// Generate chunks
Camera.position.x = renderDistance * chunkSize / 2 * 5;
Camera.position.z = renderDistance * chunkSize / 2 * 5;
Camera.position.y = 50;
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
				chunk.push(new Block(
					x * 5,
					Math.round(noise.perlin2(xOff, zOff) * amplitude / 5) * 5,
					z * 5
				))
			}
		}
		chunks.push(chunk)
	}
}

// Display terrain elements
chunks.forEach(chunk => {
	chunk.forEach(block => {
		block.display()
	})
});

// Loop rendering function
loop()