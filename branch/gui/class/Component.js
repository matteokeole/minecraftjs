/**
 * Construct a new layer component.
 *
 * Param	Type		Name=Default						Description
 * @param	{object}	[component={}]						Component data object
 * @param	{string}	[component.name]					Component name
 * @param	{string}	[component.type="default"]			Component type
 * @param	{boolean}	[component.visible=1]				Component visibility state
 * @param	{array}		[component.origin=["left", "top"]]	Component origin
 * @param	{array}		[component.offset=[0, 0]]			Component offset
 * @param	{array}		[component.size=[0, 0]]				Component size
 * @param	{string}	[component.texture]					Component texture file path, if text component the texture will be the font file path
 * @param	{array}		[component.uv=[0, 0]]				Component texture offset
 * @param	{array}		[component.slots=[]]				Component slots
 * @param	{string}	[component.text=""]					Component text value
 * @param	{string}	[component.text_background]			Component text background color (hexadecimal)
 * @param	{number}	[component.text_background_alpha=1]	Component text background alpha value
 * @param	{string}	[component.text_color="#FFFFFF"]	Component text color (hexadecimal)
 * @param	{boolean}	[component.text_shadow=false]		Component text shadow
 */
export const Component = function(component = {}) {
	// Name
	this.name = component.name;

	// Type
	this.type = component.type ?? "default";

	// Visibility state
	this.visible = component.visible ?? 1;

	// Origin
	this.origin = component.origin ?? ["left", "top"];

	// Offset
	this.offset = component.offset ?? [0, 0];

	// Size
	this.size = component.size ?? [0, 0];

	// Texture file path
	this.texture = component.texture;

	// Texture offset
	this.uv = component.uv ?? [0, 0];

	// Apply attributes depending on component type
	switch (this.type) {
		case "container":
			this.slots = component.slots ?? [];

			// Assign each slot to this component
			this.slots.forEach(s => s.component = this);

			break;

		case "text":
			// Font file path
			this.texture = "font/ascii.png";

			// Text value
			this.text = component.text ?? "";

			// Background color
			this.text_background = component.text_background ?? undefined;

			// Background opacity
			this.text_background_alpha = component.text_background_alpha ?? 1;

			// Text color
			this.text_color = component.text_color ?? "#FFFFFF";

			// Text shadow
			this.text_shadow = component.text_shadow ?? false;

			break;
	}

	return this;
};