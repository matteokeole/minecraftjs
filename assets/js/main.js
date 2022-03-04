// Set random Perlin noise seed for terrain generation
noise.seed(Math.random());

// Init Three.js objects
const
	Scene				= new THREE.Scene(),
	Renderer			= new THREE.WebGLRenderer(),
	Camera				= new THREE.PerspectiveCamera(FIELD_OF_VIEW, WINDOW_WIDTH / WINDOW_HEIGHT, .1, 1000),
	Pointer				= new THREE.Vector2(),
	Raycaster			= new THREE.Raycaster(),
	Loader				= new THREE.TextureLoader(),
	Controls			= new THREE.PointerLockControls(Camera, document.body),
	BlockGeometry		= new THREE.BoxGeometry(1, 1, 1),
	SlabGeometry		= new THREE.BoxGeometry(1, .5, 1),
	DoorGeometry		= new THREE.BoxGeometry(1, 2, .25),
	TrapdoorGeometry	= new THREE.BoxGeometry(1, 1, .25),
	BlockMaterial = ([
		"sand",	// Right
		"sand",	// Left
		"sand",	// Top
		"sand",	// Bottom
		"sand",	// Front
		"sand",	// Back
	]).map(face => {
		return new THREE.MeshBasicMaterial(
			{map: Loader.load(`assets/textures/block/${face}.png`)},
		);
	}),
	Faces = [
		{dir: [1, 0, 0, "right"]},
		{dir: [-1, 0, 0, "left"]},
		{dir: [0, 1, 0, "top"]},
		{dir: [0, -1, 0, "bottom"]},
		{dir: [0, 0, 1, "front"]},
		{dir: [0, 0, -1, "back"]},
	],
	// Selector mesh elements
	SelectorMaterial = new THREE.MeshBasicMaterial({transparent: true, opacity: 0}),
	SelectorOutline = new THREE.LineSegments(
		new THREE.EdgesGeometry(BlockGeometry),
		new THREE.LineBasicMaterial({color: 0x000000, linewidth: 4})
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
		debug("pos", `XYZ: ${Camera.position.x.toFixed(3)} / ${Camera.position.y.toFixed(5)} / ${Camera.position.z.toFixed(3)}`);
		debug("block", `Block: ${Camera.position.x.toFixed(0)} ${Camera.position.y.toFixed(0)} ${Camera.position.z.toFixed(0)}`);
		debug("facing", `Facing: (${Camera.rotation.x.toFixed(1)} / ${Camera.rotation.y.toFixed(1)} / ${Camera.rotation.z.toFixed(1)})`);
		update();
		render();
		setTimeout(() => {requestAnimationFrame(loop)}, (1000 / fps))
	},
	debug = (requestId, requestContent) => {
		// Debug function
		let requestFound = false;
		debugRequests.forEach(request => {
			if (request.id === requestId) {
				// The request is already registered, just change its content
				requestFound = true;
				request.content = requestContent;
			}
		});
		// This is a new debug request, add it to the request list
		if (!requestFound) {
			debugRequests.push({
				id: requestId,
				content: requestContent,
			})
		};

		// Print debug content on the debugger
		let debugContent = "";
		debugRequests.forEach(request => {
			debugContent += `<div><span>${request.content}</span></div>`;
		});
		debugElement.innerHTML = debugContent;
	},
	debugElement = document.querySelector("#debug"),
	debugRequests = [];
let chunks = [],
	keys = [],
	ySpeed = 0,
	canJump = true;

// Set sky color and fog
Scene.background = new THREE.Color(0x000000);
Scene.fog = new THREE.Fog(0x000000, fogBlend, fogDistance);

// Pixelise block faces
BlockMaterial.forEach(face => {face.map.magFilter = THREE.NearestFilter});

// Set renderer size
Renderer.setSize(WINDOW_WIDTH, WINDOW_HEIGHT);
document.body.appendChild(Renderer.domElement);

// Set camera and pointer position
Camera.position.x = 0;
Camera.position.y = 20;
Camera.position.z = 0;
Scene.add(Camera);
Pointer.x = .5 * 2 - 1;
Pointer.y = -.5 * 2 + 1;

/*let hand = new THREE.Mesh(BlockGeometry, BlockMaterial);
Camera.add(hand);
hand.position.set(1.45, -1.2, -1.35);
hand.rotation.set(
	0,
	Math.PI / 5.5,
	Math.PI / 55,
);*/

// Add outline to selector
Selector.add(SelectorOutline);
Scene.add(Selector);

// Generate chunks 
let instancedChunk = new THREE.InstancedMesh(
		BlockGeometry,
		BlockMaterial,
		(chunkSize * chunkSize * renderDistance * renderDistance),
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
				count++;
			}
		}
		chunks.push(chunk);
	}
}
Scene.add(instancedChunk);

// Loop rendering and stats function
loop();