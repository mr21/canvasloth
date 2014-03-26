WebGLRenderingContext.prototype.Light = function(gl) {
	this.gl = gl;
	this._dir_light_enabled = true;
	var prog = gl.shader.program;
	prog.useAmbLightingUniform    = gl.getUniformLocation(prog, 'uUseAmbLighting');
	prog.ambientColorUniform      = gl.getUniformLocation(prog, 'uAmbientColor');
	prog.useDirLightingUniform    = gl.getUniformLocation(prog, 'uUseDirLighting');
	prog.lightingDirectionUniform = gl.getUniformLocation(prog, 'uLightingDirection');
	prog.directionalColorUniform  = gl.getUniformLocation(prog, 'uDirectionalColor');
};

WebGLRenderingContext.prototype.Light.prototype = {
	ambient : function(r, g, b) {
		this.gl.uniform1i(this.gl.shader.program.useAmbLightingUniform, true);
		this.gl.uniform3f(this.gl.shader.program.ambientColorUniform, r, g, b);
	},
	dir : function(x, y, z, r, g, b) {
		var adjustedLD = vec3.create();
		vec3.normalize(adjustedLD, [x, y, z]);
		vec3.scale(adjustedLD, adjustedLD, -1);
		this.gl.uniform3fv(this.gl.shader.program.lightingDirectionUniform, adjustedLD);
		this.gl.uniform3f(this.gl.shader.program.directionalColorUniform, r, g, b);
	},
	enableAmbient : function(activate) {
		this._amb_light_enabled = activate;
		this.gl.uniform1i(this.gl.shader.program.useAmbLightingUniform, activate);
	},
	enableDir : function(activate) {
		this._dir_light_enabled = activate;
		this.gl.uniform1i(this.gl.shader.program.useDirLightingUniform, activate);
	}
};
