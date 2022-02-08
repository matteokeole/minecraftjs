// Set a random Perlin noise seed
noise.seed(Math.random());

const scene = new THREE.Scene(),
	renderer = new THREE.WebGLRenderer(),
	camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, .1, 1000),
	controls = new THREE.PointerLockControls(camera, document.body),
	movingSpeed = .15,
	acc = .006,
	loader = new THREE.TextureLoader(),
	Block = function(x, y, z) {
		this.x = x;
		this.y = y;
		this.z = z;
		this.display = function() {
			const blockGeometry = new THREE.BoxBufferGeometry(5, 5, 5),
				blockMaterial = [
					new THREE.MeshBasicMaterial({map: loader.load("assets/textures/block/grass_block_side.png")}),
					new THREE.MeshBasicMaterial({map: loader.load("assets/textures/block/grass_block_side.png")}),
					new THREE.MeshBasicMaterial({map: loader.load("assets/textures/block/grass_block_top.png")}),
					new THREE.MeshBasicMaterial({map: loader.load("assets/textures/block/grass_block_bottom.png")}),
					new THREE.MeshBasicMaterial({map: loader.load("assets/textures/block/grass_block_side.png")}),
					new THREE.MeshBasicMaterial({map: loader.load("assets/textures/block/grass_block_side.png")}),
				];
			blockMaterial.forEach(e => {e.magFilter = THREE.NearestFilter});
			blockMaterial.forEach(e => {e.minFilter = THREE.LinearMipMapLinearFilter});
			const block = new THREE.Mesh(blockGeometry, blockMaterial),
				edges = new THREE.EdgesGeometry(blockGeometry),
				line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({color: 0x000000}));
			scene.add(block);
			block.position.x = this.x;
			block.position.y = this.y - 10;
			block.position.z = this.z;
			/*scene.add(line);
			line.position.x = this.x;
			line.position.y = this.y - 10;
			line.position.z = this.z*/
		}
	},
	render = () => {renderer.render(scene, camera)},
	loop = () => {
		requestAnimationFrame(loop);
		update();
		render()
	},
	update = () => {
		// Z key
		if (keys.includes("z")) {
			controls.moveForward(movingSpeed);
			if (!settings.autojump) {
				for (let i = 0; i < blocks.length; i++) {
					if (
						camera.position.x <= blocks[i].x + 2.5 &&
						camera.position.x >= blocks[i].x - 2.5 &&
						camera.position.z <= blocks[i].z + 2.5 &&
						camera.position.z >= blocks[i].z - 2.5
					) {
						if (camera.position.y == blocks[i].y - 2.5) {
							controls.moveForward(-1 * movingSpeed);
						}
					}
				}
			}
		}
		// Q key
		if (keys.includes("q")) {
			controls.moveRight(-1 * movingSpeed);
			if (!settings.autojump) {
				for (let i = 0; i < blocks.length; i++) {
					if (
						camera.position.x <= blocks[i].x + 2.5 &&
						camera.position.x >= blocks[i].x - 2.5 &&
						camera.position.z <= blocks[i].z + 2.5 &&
						camera.position.z >= blocks[i].z - 2.5
					) {
						if (camera.position.y == blocks[i].y - 2.5) {
							controls.moveRight(movingSpeed);
						}
					}
				}
			}
		}
		// S key
		if (keys.includes("s")) {
			controls.moveForward(-1 * movingSpeed);
			if (!settings.autojump) {
				for (let i = 0; i < blocks.length; i++) {
					if (
						camera.position.x <= blocks[i].x + 2.5 &&
						camera.position.x >= blocks[i].x - 2.5 &&
						camera.position.z <= blocks[i].z + 2.5 &&
						camera.position.z >= blocks[i].z - 2.5
					) {
						if (camera.position.y == blocks[i].y - 2.5) {
							controls.moveForward(movingSpeed);
						}
					}
				}
			}
		}
		// D key
		if (keys.includes("d")) {
			controls.moveRight(movingSpeed);
			if (!settings.autojump) {
				for (let i = 0; i < blocks.length; i++) {
					if (
						camera.position.x <= blocks[i].x + 2.5 &&
						camera.position.x >= blocks[i].x - 2.5 &&
						camera.position.z <= blocks[i].z + 2.5 &&
						camera.position.z >= blocks[i].z - 2.5
					) {
						if (camera.position.y == blocks[i].y - 2.5) {
							controls.moveRight(-1 * movingSpeed);
						}
					}
				}
			}
		}
		camera.position.y -= ySpeed;
		ySpeed += acc;
		for (let i = 0; i < blocks.length; i++) {
			if (
				camera.position.x <= blocks[i].x + 2.5 &&
				camera.position.x >= blocks[i].x - 2.5 &&
				camera.position.z <= blocks[i].z + 2.5 &&
				camera.position.z >= blocks[i].z - 2.5
			) {
				if (
					camera.position.y <= blocks[i].y + 2.5 &&
					camera.position.y >= blocks[i].y - 2.5
				) {
					camera.position.y = blocks[i].y + 2.5;
					ySpeed = 0;
					canJump = true;
					break
				}
			}
		}
	},
	resize = () => {
		renderer.setSize(window.innerWidth, window.innerHeight);
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix()
	},
	toggleAutojump = e => {
		settings.autojump = !settings.autojump;
		e.textContent = `Autojump: ${settings.autojump ? "ON" : "OFF"}`
	};
let keys = [],
	ySpeed = 0,
	canJump = true,
	settings = {
		autojump: false
	};

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

// Create blocks
const blocks = [],
	amplitude = 100,
	inc = 0.05;
let xOff = 0,
	zOff = 0;
for (let x = -10; x < 10; x++) {
	xOff = 0;
	for (let z = -10; z < 10; z++) {
		blocks.push(new Block(
			x * 5,
			Math.round(noise.perlin2(xOff, zOff) * amplitude / 5) * 5,
			z * 5
		));
		xOff += inc
	}
	zOff += inc
}

// Display terrain
blocks.forEach(block => {block.display()});

// Loop rendering function
loop()