const
	Font = {
		chars: " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_’abcdefghijklmnopqrstuvwxyz{|}~",
		charSize: {},
	},
	Keybinds = {
		hotbar_slots: [
			"Digit1",
			"Digit2",
			"Digit3",
			"Digit4",
			"Digit5",
			"Digit6",
			"Digit7",
			"Digit8",
			"Digit9",
		],
		toggle_hud: "F1",
	};

// Set base size on all character
Font.chars.split("").map(char => Font.charSize[char] = [6, 8]);

// Change characters with unique size
Font.charSize[" "] = [4, 8];
Font.charSize["!"] = [2, 8];
Font.charSize['"'] = [4, 8];
Font.charSize["'"] = [2, 8];
Font.charSize["("] = [4, 8];
Font.charSize[")"] = [4, 8];
Font.charSize["*"] = [4, 8];
Font.charSize[","] = [2, 8];
Font.charSize["."] = [2, 8];
Font.charSize[":"] = [2, 8];
Font.charSize[";"] = [2, 8];
Font.charSize["<"] = [5, 8];
Font.charSize[">"] = [5, 8];
Font.charSize["@"] = [7, 8];
Font.charSize["I"] = [4, 8];
Font.charSize["["] = [4, 8];
Font.charSize["]"] = [4, 8];
Font.charSize["’"] = [3, 8];
Font.charSize["f"] = [5, 8];
Font.charSize["i"] = [2, 8];
Font.charSize["k"] = [5, 8];
Font.charSize["l"] = [3, 8];
Font.charSize["t"] = [4, 8];
Font.charSize["{"] = [4, 8];
Font.charSize["|"] = [2, 8];
Font.charSize["}"] = [4, 8];