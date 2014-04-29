Canvasloth.prototype.CubeMap3D = function() {
	var gl = this.gl,
		lights = this.lights,
		images = this.images,
		camera = this.camera,
		matrix = this.matrix,
		textures = this.textures;

	this.cubemap = {
		enable:  function() { this.active = true; },
		disable: function() { this.active = false; },
		toggle:  function() { this.active ? this.disable() : this.enable(); },
		texture: function(name) {
			return this.cube.texture(name), this;
		},
		render: function() {
			if (this.active) {
				var lightActive = lights.active;
				if (lightActive)
					lights.disable();
				gl.disable(gl.DEPTH_TEST);
				matrix.push().translate(camera.eyX, camera.eyY, camera.eyZ);
					this.cube.draw();
				matrix.pop();
				gl.enable(gl.DEPTH_TEST);
				if (lightActive)
					lights.enable();
			}
		}
	};

	this.cubemap.cube = this.primitives.create({
		type: 'cubemap', size: 10,
		r:255, g:255, b:255
	});
	this.cubemap.enable();
};
