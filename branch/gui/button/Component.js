/**
 * Construct a new component.
 *
 * Param	Type		Name=Default		Description
 * @param	{object}	[component={}]		Component data object
 * @param	{array}		component.origin	Component origin
 * @param	{array}		component.offset	Component offset
 * @param	{array}		component.size		Component size
 * @param	{string}	component.texture	Component texture file path, if text component the texture will be the font file path
 * @param	{array}		component.uv		Component texture offset
 */
export const Component = function(c = {}) {
	// Type
	this.type = "default";

	// Origin
	this.origin = c.origin;

	// Offset
	this.offset = c.offset;

	// Size
	this.size = c.size;

	// Texture file path
	this.texture = c.texture;

	// Texture offset
	this.uv = c.uv;
};