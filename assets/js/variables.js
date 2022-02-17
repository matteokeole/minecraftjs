const
	u = 4, // Block size
	// Generation variables
	amplitude = 30,
	inc = .05,
	// Chunks and distance variables
	chunkSize = 10,
	renderDistance = 3,
	selectionDistance = u * 8,
	fogDistance = u * 10,
	// Movement variables
	movingSpeed = .5,
	acc = .065,
	// Player settings
	Settings = {autojump: false};