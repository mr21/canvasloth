Canvasloth.prototype.Light3D = function() {
	var gl = this.ctx.ctx,
	    prog = this.shader.program;
	this.light = {
		ambient : function(r, g, b) {
			gl.uniform1i(prog.useAmbLightingUniform, true);
			gl.uniform3f(prog.ambientColorUniform, r, g, b);
		},
		dir : function(x, y, z, r, g, b) {
			var adjustedLD = vec3.create();
			vec3.normalize(adjustedLD, [x, y, z]);
			vec3.scale(adjustedLD, adjustedLD, -1);
			gl.uniform3fv(prog.lightingDirectionUniform, adjustedLD);
			gl.uniform3f(prog.directionalColorUniform, r, g, b);
		},
		enableAmbient : function(activate) {
			this._amb_light_enabled = activate;
			gl.uniform1i(prog.useAmbLightingUniform, activate);
		},
		enableDir : function(activate) {
			this._dir_light_enabled = activate;
			gl.uniform1i(prog.useDirLightingUniform, activate);
		},
		_dir_light_enabled : true
	};
	prog.useAmbLightingUniform    = gl.getUniformLocation(prog, 'uUseAmbLighting');
	prog.ambientColorUniform      = gl.getUniformLocation(prog, 'uAmbientColor');
	prog.useDirLightingUniform    = gl.getUniformLocation(prog, 'uUseDirLighting');
	prog.lightingDirectionUniform = gl.getUniformLocation(prog, 'uLightingDirection');
	prog.directionalColorUniform  = gl.getUniformLocation(prog, 'uDirectionalColor');
};
