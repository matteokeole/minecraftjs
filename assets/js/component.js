export function Component(c = {}) {
	this.type = c.type ?? "default";
	this.origin = c.origin ?? ["left", "top"];
	this.offset = c.offset ?? [0, 0];
	this.size = c.size ?? [0, 0];
	this.texture = c.type === "text" ? "font/ascii.png" : c.texture;
	this.uv = c.uv ?? [0, 0];
}