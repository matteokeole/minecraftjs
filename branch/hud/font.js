const
	chars = " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_’abcdefghijklmnopqrstuvwxyz{|}~",
	charSize = {};

chars.split("").map(char => charSize[char] = [6, 8]);

// Characters with special width
charSize[" "] = [4, 8];
charSize["!"] = [2, 8];
charSize["\""] = [4, 8];
charSize["'"] = [2, 8];
charSize["("] = [4, 8];
charSize[")"] = [4, 8];
charSize["*"] = [4, 8];
charSize[","] = [2, 8];
charSize["."] = [2, 8];
charSize[":"] = [2, 8];
charSize[";"] = [2, 8];
charSize["<"] = [5, 8];
charSize[">"] = [5, 8];
charSize["@"] = [7, 8];
charSize["I"] = [4, 8];
charSize["["] = [4, 8];
charSize["]"] = [4, 8];
charSize["’"] = [3, 8];
charSize["f"] = [5, 8];
charSize["i"] = [2, 8];
charSize["k"] = [5, 8];
charSize["l"] = [3, 8];
charSize["t"] = [4, 8];
charSize["{"] = [4, 8];
charSize["|"] = [2, 8];
charSize["}"] = [4, 8];