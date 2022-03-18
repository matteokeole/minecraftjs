/**
 * Construct a new layer component.
 *
 * Param	Type		Name					Description						Default value
 * @param	{object}	component				Component data object			{}
 * @param	{string}	component.name			Component name (used in layer)	"UNKNOWN_COMPONENT"
 * @param	{string}	component.type			Component element type			"default"
 * @param	{boolean}	component.visible		Component visibility attribute	1
 * @param	{array}		component.origin		Component position origin		{x: 0, y: 0}
 * @param	{array}		component.offset		Component position offset		{x: 0, y: 0}
 * @param	{array}		component.size			Component size					{x: 0, y: 0}
 * @param	{string}	component.texture		Component texture file path		""
 * @param	{array}		component.uv			Component texture offset		{x: 0, y: 0}
 * @param	{array}		component.slots			Component slots					[] if component type = "container"
 * @param	{array}		component.text			Component text value			"" if component type = "text"
 * @param	{array}		component.text_color	Component text color			"#FFF" if component type = "text"
 * @param	{array}		component.text_size		Component text size				20 if component type = "text"
 * @param	{array}		component.text_shadow	Component text shadow			false if component type = "text"
 */
export const Component = function(component = {}) {
	// Name
	this.name = component.name ?? "UNKNOWN_COMPONENT";

	// Type
	this.type = component.type ?? "default";

	// Visibility status
	this.visible = component.visible ?? 1;

	// Origin
	this.origin = {
		x: component.origin ? component.origin[0] : 0,
		y: component.origin ? component.origin[1] : 0,
	};

	// Offset
	this.offset = {
		x: component.offset ? component.offset[0] : 0,
		y: component.offset ? component.offset[1] : 0,
	};

	// Size
	this.size = {
		x: component.size ? component.size[0] : 0,
		y: component.size ? component.size[1] : 0,
	};

	// Texture file path
	this.texture = component.texture ?? "";

	// Texture offset
	this.uv = {
		x: component.uv ? component.uv[0] : 0,
		y: component.uv ? component.uv[1] : 0,
	};

	/**
	 * Toggle component visibility.
 	 * @param	{boolean}	state				The visibility to be applied	Opposite of the current visibility
	 */
	this.toggle = (state = !this.visible) => {
		this.visible = Number(state);

		// Re-draw component
		this.layer.updateComponent(this);
	};

	/**
	 * Update component position on the layer.
	 * NOTE: Use a canvas update method to apply the new coordinates.
 	 * @param	{array}	origin				The new component position			[current X position, current Y position]
	 */
	this.move = (origin = [this.origin.x, this.origin.y]) => {
		this.origin.x = origin[0];
		this.origin.y = origin[1];
	};

	// Special attributes, depending on component type
	switch (this.type) {
		case "container":
			this.slots = component.slots ?? [];

			// Assign each slot to this component
			for (let slot of this.slots) {
				slot.init();
				slot.component = this;
			}

			break;

		case "text":
			this.text = component.text ?? "";
			this.text_color = component.text_color ?? "#FFFFFF";
			this.text_shadow = component.text_shadow ?? false;

			break;
	}

	return this;
};