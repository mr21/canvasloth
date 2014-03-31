Canvasloth.prototype.Lights3D = function() {
	var gl = this.ctx,
	    prog = this.shaders.program;
	this.lights = {
		ambientColorUniform      : gl.getUniformLocation(prog, 'uAmbientColor'),
		lightingDirectionUniform : gl.getUniformLocation(prog, 'uLightingDirection'),
		directionalColorUniform  : gl.getUniformLocation(prog, 'uDirectionalColor'),
		enable: function() {
			this.active = true;
			this.ambient(0,0,0);
			return this;
		},
		disable: function() {
			this.ambient(1,1,1);
			this.active = false;
			return this;
		},
		ambient : function(r, g, b) {
			if (this.active) {
				gl.uniform3f(this.ambientColorUniform, r, g, b);
			}
			return this;
		},
		dir : function(x, y, z, r, g, b) {
			if (this.active) {
				var adjustedLD = vec3.create();
				vec3.normalize(adjustedLD, [x, y, z]);
				vec3.scale(adjustedLD, adjustedLD, -1);
				gl.uniform3fv(this.lightingDirectionUniform, adjustedLD);
				gl.uniform3f(this.directionalColorUniform, r, g, b);
			}
			return this;
		}
	};
};
