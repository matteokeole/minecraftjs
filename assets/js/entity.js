function Entity(x, y, z, name) {
	this.x = x;
	this.y = y;
	this.z = z;
	this.name = name;

	this.entity = new THREE.Mesh();
	this.entity.position.set(this.x, this.y, this.z);
	Scene.add(this.entity);
}

Entity.prototype.setModel = function(model) {
	fetch(`assets/models/${model}`)
		.then(response => response.json())
		.then(response => {
			this.model = response;

			// Construct entity model
			for (let bone of this.model[`geometry.${this.name}`].bones) {
				const obj = new THREE.Mesh(
					new THREE.BoxGeometry(
						bone.cubes[0].size[0] / 16,
						bone.cubes[0].size[1] / 16,
						bone.cubes[0].size[2] / 16
					),
					new THREE.MeshBasicMaterial({map: Loader.load(this.texture)})
				);
				obj.position.set(
					bone.cubes[0].origin[0] / 16,
					bone.cubes[0].origin[1] / 16,
					bone.cubes[0].origin[2] / 16
				);
				console.log(obj)
				obj.material.map.mapping = THREE.UVMapping;
				this.entity.add(obj);
			}
		});
}

Entity.prototype.setTexture = function(texture) {
	this.texture = `assets/textures/entity/${texture}`;
	/*let t = new Image();
	t.addEventListener("load", () => {
		console.log(t.width);
	});
	t.src = this.texture;*/
}