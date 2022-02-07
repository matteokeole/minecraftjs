// Set a random Perlin noise seed
noise.seed(Math.random());

const scene = new THREE.Scene(),
	renderer = new THREE.WebGLRenderer(),
	camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, .1, 1000),
	controls = new THREE.PointerLockControls(camera, document.body),
	movingSpeed = .15,
	acc = .006,
	Block = function(x, y, z) {
		this.x = x;
		this.y = y;
		this.z = z;
		this.display = function() {
			const blockGeometry = new THREE.BoxBufferGeometry(5, 5, 5),
				blockMaterial = new THREE.MeshBasicMaterial({color: 0x000000}),
				block = new THREE.Mesh(blockGeometry, blockMaterial);
			scene.add(block);
			block.position.x = this.x;
			block.position.y = this.y - 10;
			block.position.z = this.z;
			const edges = new THREE.EdgesGeometry(blockGeometry),
				line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({color: 0xffffff}));
			scene.add(line);
			line.position.x = this.x;
			line.position.y = this.y - 10;
			line.position.z = this.z
		}
	},
	render = () => {renderer.render(scene, camera)},
	loop = () => {
		requestAnimationFrame(loop);
		update();
		render()
	},
	update = () => {
		if (keys.includes("z")) controls.moveForward(movingSpeed);
		if (keys.includes("q")) controls.moveRight(-1 * movingSpeed);
		if (keys.includes("s")) controls.moveForward(-1 * movingSpeed);
		if (keys.includes("d")) controls.moveRight(movingSpeed);
		camera.position.y -= ySpeed;
		ySpeed += acc;
		for (let i = 0; i < blocks.length; i++) {
			if (
				camera.position.x <= blocks[i].x + 5 &&
				camera.position.x >= blocks[i].x - 5 &&
				camera.position.z <= blocks[i].z + 5 &&
				camera.position.z >= blocks[i].z - 5
			) {
				if (camera.position.y < blocks[i].y) {
					camera.position.y = blocks[i].y;
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
	};
let keys = [],
	ySpeed = 0,
	canJump = true;

// Set renderer size
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Event listeners
addEventListener("mousedown", () => {controls.lock()});
addEventListener("keydown", e => {
	keys.push(e.key);
	if (e.key === " " && canJump) {
		canJump = false;
		ySpeed = -0.28
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
for (let x = 0; x < 20; x++) {
	xOff = 0;
	for (let z = 0; z < 20; z++) {
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