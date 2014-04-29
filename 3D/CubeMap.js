Canvasloth.prototype.CubeMap3D = function() {
	var gl = this.gl,
		lights = this.lights,
		images = this.images,
		textures = this.textures;

	this.cubemap = {
		enable:  function() { this.active = true; },
		disable: function() { this.active = false; },
		toggle:  function() { this.active ? this.disable() : this.enable(); },
		texture: function(name) {
			/*var img = images.find(name);
			if (img) {
				var tex = textures.create(img);
				textures.bind(tex);
			}*/
			return this;
		},
		render: function() {
			if (this.active) {
				var lightActive = lights.active;
				if (lightActive)
					lights.disable();
				gl.disable(gl.DEPTH_TEST);
				this.cube.draw();
				gl.enable(gl.DEPTH_TEST);
				if (lightActive)
					lights.enable();
			}
		}
	};

	this.cubemap.cube = this.primitives.create({
		type: 'cube', size: 100,
		r:30, g:30, b:30
	});
	this.cubemap.enable();
};
