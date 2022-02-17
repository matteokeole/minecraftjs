// Set random Perlin noise seed for terrain generation
noise.seed(Math.random());

// Init Three.js objects
const
	Scene = new THREE.Scene(),
	Renderer = new THREE.WebGLRenderer(),
	Camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, .1, 1000),
	Raycaster = new THREE.Raycaster(),
	Pointer = new THREE.Vector2(),
	Loader = new THREE.TextureLoader(),
	Controls = new THREE.PointerLockControls(Camera, document.body),
	BlockGeometry = new THREE.BoxGeometry(u, u, u),
	BlockMaterial = [
		new THREE.MeshBasicMaterial({map: Loader.load("assets/textures/block/podzol_side.png")}),
		new THREE.MeshBasicMaterial({map: Loader.load("assets/textures/block/podzol_side.png")}),
		new THREE.MeshBasicMaterial({map: Loader.load("assets/textures/block/podzol_top.png")}),
		new THREE.MeshBasicMaterial({map: Loader.load("assets/textures/block/dirt.png")}),
		new THREE.MeshBasicMaterial({map: Loader.load("assets/textures/block/podzol_side.png")}),
		new THREE.MeshBasicMaterial({map: Loader.load("assets/textures/block/podzol_side.png")})
	],
	Faces = [
		{dir: [ u,  0,  0, "right"]},
		{dir: [-u,  0,  0, "left"]},
		{dir: [ 0,  u,  0, "top"]},
		{dir: [ 0, -u,  0, "bottom"]},
		{dir: [ 0,  0,  u, "front"]},
		{dir: [ 0,  0, -u, "back"]}
	],
	// Selector mesh elements
	SelectorMaterial = new THREE.MeshBasicMaterial({transparent: true, opacity: 0}),
	SelectorOutline = new THREE.LineSegments(
		new THREE.EdgesGeometry(BlockGeometry),
		new THREE.LineBasicMaterial({color: 0xffff00, linewidth: 2})
	),
	Selector = new THREE.Mesh(BlockGeometry, SelectorMaterial),
	getBlock = (pos, axis) => {
		const map = [];
		chunks.forEach(chunk => {
			chunk.forEach(block => {
				map.push(block[axis])
			})
		});
		return pos === "lowest" ? Math.min.apply(null, map) : Math.max.apply(null, map)
	},
	loop = () => {
		requestAnimationFrame(loop);
		update();
		render();
		debug(20, `X: ${Camera.position.x}<br>Y: ${Camera.position.y}<br>Z: ${Camera.position.z}`)
	},
	debug = (requestId, requestContent) => {
		// Debug function
		let requestFound = false;
		debugRequests.forEach(request => {
			if (request && request.id === requestId) requestFound = true;
		})
		if (!requestFound) {
			debugRequests.push({
				id: requestId,
				content: requestContent
			})
		}

		let debugContent = "";
		debugRequests.forEach(request => {debugContent += request.content + "<br>"});
		debugElement.innerHTML = debugContent
	},
	debugElement = document.querySelector("#debug"),
	debugRequests = [];
let chunks = [],
	keys = [],
	ySpeed = 0,
	canJump = true;

// Set sky color and fog
Scene.background = new THREE.Color(0x000000);
Scene.fog = new THREE.Fog(0x000000, 10, fogDistance);

// Pixelise block faces
BlockMaterial.forEach(face => {face.map.magFilter = THREE.NearestFilter});

// Set renderer size
Renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(Renderer.domElement);

// Set camera and pointer position
Camera.position.x = 0;
Camera.position.z = 0;
Camera.position.y = 20;
Pointer.x = .5 * 2 - 1;
Pointer.y = -.5 * 2 + 1;

// Add outline to selector
Selector.add(SelectorOutline);

Scene.add(Selector);

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
				const v = Math.round(noise.perlin2(xOff, zOff) * amplitude / u) * u;
				chunk.push(new Block(x * u, v, z * u));
				let matrix = new THREE.Matrix4().makeTranslation(x * u, v, z * u);
				instancedChunk.setMatrixAt(count, matrix);
				count++
			}
		}
		chunks.push(chunk)
	}
}
Scene.add(instancedChunk);

// Loop rendering and stats function
loop()