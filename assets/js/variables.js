let
	// Generation variables
	amplitude = 30,
	inc = .05,
	// Chunks and render distance variables
	chunks = [],
	chunkSize = 10,
	renderDistance = 3,
	// Movement variables
	keys = [],
	movingSpeed = .5,
	acc = .065,
	ySpeed = 0,
	canJump = true,
	// Player settings
	Settings = {autojump: false};