// Set random Perlin noise seed for the terrain generation
noise.seed(Math.random());

// Init
const Database = {
	blocks: [{
			id: "1",
			name: "minecraft:stone",
			textures: ["stone", "stone", "stone", "stone", "stone", "stone"]
		}, {
			id: "2",
			name: "minecraft:grass",
			textures: ["grass_block_side", "grass_block_side", "grass_block_top", "grass_block_bottom", "grass_block_side", "grass_block_side"]
		}, {
			id: "3",
			name: "minecraft:dirt",
			textures: ["dirt", "dirt", "dirt", "dirt", "dirt", "dirt"]
		}, {
			id: "3:2",
			name: "minecraft:podzol",
			textures: ["podzol_side", "podzol_side", "podzol_top", "podzol_bottom", "podzol_side", "podzol_side"]
	}]
},
scene = new THREE.Scene(),
renderer = new THREE.WebGLRenderer(),
camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, .1, 1000),
loader = new THREE.TextureLoader(),
controls = new THREE.PointerLockControls(camera, document.body),
Block = function(id, x, y, z) {
	// Block constructor
	this.id = id;
	this.x = x;
	this.y = y;
	this.z = z;
	this.mesh;
	this.display = function() {
		for (let block of Database.blocks) {
			if (block.id === this.id) {
				const geometry = new THREE.BoxGeometry(5, 5, 5),
					material = block.textures.map(texture => {
						let m = new THREE.MeshBasicMaterial({map: loader.load(`assets/textures/block/${texture}.png`)});
						m.map.magFilter = THREE.NearestFilter;
						return m
					});
				this.mesh = new THREE.Mesh(geometry, material);
				scene.add(this.mesh);
				this.mesh.position.x = this.x;
				this.mesh.position.y = this.y - 10;
				this.mesh.position.z = this.z
			}
		}
	}
},
getLowestBlockX = () => {
	let pos = [];
	for (let i = 0; i < chunks.length; i++) {
		for (let j = 0; j < chunks.length; j++) {
			pos.push(chunks[i][j].x)
		}
	}
	return Math.min.apply(null, pos)
},
getHighestBlockX = () => {
	let pos = [];
	for (let i = 0; i < chunks.length; i++) {
		for (let j = 0; j < chunks.length; j++) {
			pos.push(chunks[i][j].x)
		}
	}
	return Math.max.apply(null, pos)
},
getLowestBlockZ = () => {
	let pos = [];
	for (let i = 0; i < chunks.length; i++) {
		for (let j = 0; j < chunks.length; j++) {
			pos.push(chunks[i][j].z)
		}
	}
	return Math.min.apply(null, pos)
},
getHighestBlockZ = () => {
	let pos = [];
	for (let i = 0; i < chunks.length; i++) {
		for (let j = 0; j < chunks.length; j++) {
			pos.push(chunks[i][j].z)
		}
	}
	return Math.max.apply(null, pos)
},
render = () => {renderer.render(scene, camera)},
loop = () => {
	requestAnimationFrame(loop);
	update();
	render()
},
update = () => {
	// Forward key
	if (keys.includes("z")) {
		controls.moveForward(movingSpeed);
		if (!settings.autojump) {
			for (let i = 0; i < chunks.length; i++) {
				for (let j = 0; j < chunks[i].length; j++) {
					if (
						camera.position.x <= chunks[i][j].x + 2.5 &&
						camera.position.x >= chunks[i][j].x - 2.5 &&
						camera.position.z <= chunks[i][j].z + 2.5 &&
						camera.position.z >= chunks[i][j].z - 2.5
					) {
						if (camera.position.y == chunks[i][j].y - 2.5) {
							controls.moveForward(-movingSpeed)
						}
					}
				}
			}
		}
	}
	// Left key
	if (keys.includes("q")) {
		controls.moveRight(-movingSpeed);
		if (!settings.autojump) {
			for (let i = 0; i < chunks.length; i++) {
				for (let j = 0; j < chunks[i].length; j++) {
					if (
						camera.position.x <= chunks[i][j].x + 2.5 &&
						camera.position.x >= chunks[i][j].x - 2.5 &&
						camera.position.z <= chunks[i][j].z + 2.5 &&
						camera.position.z >= chunks[i][j].z - 2.5
					) {
						if (camera.position.y == chunks[i][j].y - 2.5) {
							controls.moveRight(movingSpeed)
						}
					}
				}
			}
		}
	}
	// Backward key
	if (keys.includes("s")) {
		controls.moveForward(-movingSpeed);
		if (!settings.autojump) {
			for (let i = 0; i < chunks.length; i++) {
				for (let j = 0; j < chunks[i].length; j++) {
					if (
						camera.position.x <= chunks[i][j].x + 2.5 &&
						camera.position.x >= chunks[i][j].x - 2.5 &&
						camera.position.z <= chunks[i][j].z + 2.5 &&
						camera.position.z >= chunks[i][j].z - 2.5
					) {
						if (camera.position.y == chunks[i][j].y - 2.5) {
							controls.moveForward(movingSpeed)
						}
					}
				}
			}
		}
	}
	// Right key
	if (keys.includes("d")) {
		controls.moveRight(movingSpeed);
		if (!settings.autojump) {
			for (let i = 0; i < chunks.length; i++) {
				for (let j = 0; j < chunks[i].length; j++) {
					if (
						camera.position.x <= chunks[i][j].x + 2.5 &&
						camera.position.x >= chunks[i][j].x - 2.5 &&
						camera.position.z <= chunks[i][j].z + 2.5 &&
						camera.position.z >= chunks[i][j].z - 2.5
					) {
						if (camera.position.y == chunks[i][j].y - 2.5) {
							controls.moveRight(-movingSpeed)
						}
					}
				}
			}
		}
	}
	camera.position.y -= ySpeed;
	ySpeed += acc;
	for (let i = 0; i < chunks.length; i++) {
		for (let j = 0; j < chunks[i].length; j++) {
			if (
				camera.position.x <= chunks[i][j].x + 2.5 &&
				camera.position.x >= chunks[i][j].x - 2.5 &&
				camera.position.z <= chunks[i][j].z + 2.5 &&
				camera.position.z >= chunks[i][j].z - 2.5
			) {
				if (
					camera.position.y <= chunks[i][j].y + 2.5 &&
					camera.position.y >= chunks[i][j].y - 2.5
				) {
					camera.position.y = chunks[i][j].y + 2.5;
					ySpeed = 0;
					canJump = true;
					break
				}
			}
		}
	}
	// Infinite terrain genetation
	if (camera.position.z <= getLowestBlockZ() + 15) {
		// 15 = 3 blocks
		/*
			[0], [3], [6],
			[1], [x], [7],
			[2], [5], [8]
		*/
		// Remove chunks behind the player
		for (let i = 0; i < chunks.length; i++) {
			if ((i + 1) % renderDistance == 0) {
				for (let j = 0; j < chunks[i].length; j++) {
					scene.remove(chunks[i][j].mesh)
				}
			}
		}
		// Add new chunks in front of the player
		let newChunks = [];
		for (let i = 0; i < chunks.length; i++) {
			if ((i + 1) % renderDistance != 0) {
				newChunks.push(chunks[i])
			}
		}
		// Add blocks
		let lowestX = getLowestBlockX();
			lowestZ = getLowestBlockZ();
		for (let i = 0; i < renderDistance; i++) {
			let chunk = [];
			for (let x = lowestX + (i * chunkSize * 5); x < lowestX + (i * chunkSize * 5) + (chunkSize * 5); x += 5) {
				for (let z = lowestZ - (chunkSize * 5); z < lowestZ; z += 5) {
					xOff = inc * x / 5;
					zOff = inc * z / 5;
					chunk.push(new Block(
						"3:2",
						x,
						Math.round(noise.perlin2(xOff, zOff) * amplitude / 5) * 5,
						z
					))
				}
			}
			newChunks.splice(i * renderDistance, 0, chunk)
		}
		chunks = newChunks;
		for (let i = 0; i < chunks.length; i++) {
			if (i % renderDistance == 0) {
				for (let j = 0; j < chunks[i].length; j++) {
					chunks[i][j].display()
				}
			}
		}
	}
},
resize = () => {
	renderer.setSize(window.innerWidth, window.innerHeight);
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix()
},
toggleAutojump = button => {
	// Toggle autojump setting
	settings.autojump = !settings.autojump;
	button.textContent = `Autojump: ${settings.autojump ? "ON" : "OFF"}`
};
// Game variables
let amplitude = 30 + (Math.random() * 70),
	inc = 0.05,
	keys = [],
	movingSpeed = .15,
	acc = .006,
	ySpeed = 0,
	canJump = true,
	chunks = [],
	chunkSize = 3,
	renderDistance = 3,
	settings = {autojump: false};

// Set scene background color
scene.background = new THREE.Color(0x1b4745);

// Set renderer size
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Event listeners
addEventListener("click", () => {controls.lock()});
addEventListener("keydown", e => {
	keys.push(e.key);
	if (e.key === " " && canJump) {
		canJump = false;
		ySpeed = -.28
	}
});
addEventListener("keyup", e => {
	const newKeys = [];
	for (let i = 0; i < keys.length; i++) {
		if (keys[i] !== e.key) newKeys.push(keys[i])
	}
	keys = newKeys
});
addEventListener("resize", resize);

// Generate chunks
camera.position.x = renderDistance * chunkSize / 2 * 5;
camera.position.z = renderDistance * chunkSize / 2 * 5;
camera.position.y = 50;
for (let i = 0; i < renderDistance; i++) {
	let chunk = [];
	for (let j = 0; j < renderDistance; j++) {
		for (let x = (i * chunkSize); x < (i * chunkSize) + chunkSize; x++) {
			for (let z = (j * chunkSize); z < (j * chunkSize) + chunkSize; z++) {
				xOff = inc * x;
				zOff = inc * z;
				chunk.push(new Block(
					"3:2",
					x * 5,
					Math.round(noise.perlin2(xOff, zOff) * amplitude / 5) * 5,
					z * 5
				))
			}
		}
	}
	chunks.push(chunk)
}

// Display terrain elements
chunks.forEach(chunk => {
	chunk.forEach(block => {
		block.display()
	})
});

// Loop rendering function
loop()