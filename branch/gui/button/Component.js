/**
 * Construct a new layer component.
 *
 * Param	Type		Name=Default						Description
 * @param	{object}	[component={}]						Component data object
 * @param	{array}		[component.origin=["left", "top"]]	Component origin
 * @param	{array}		[component.offset=[0, 0]]			Component offset
 * @param	{array}		[component.size=[0, 0]]				Component size
 * @param	{string}	[component.texture]					Component texture file path, if text component the texture will be the font file path
 * @param	{array}		[component.uv=[0, 0]]				Component texture offset
 */
export const Component = function(c) {
	// Type
	this.type = "default";

	// Origin
	this.origin = c.origin ?? ["left", "top"];

	// Offset
	this.offset = c.offset ?? [0, 0];

	// Size
	this.size = c.size ?? [0, 0];

	// Texture file path
	this.texture = c.texture;

	// Texture offset
	this.uv = c.uv ?? [0, 0];
};