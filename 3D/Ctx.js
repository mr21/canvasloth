Canvasloth.prototype.Ctx3D = function() {
	var cnv = this,
		canvas = this.webgl.canvas,
		matrix = this.webgl.matrix,
		gl = this.gl;

	gl.resize = function() {
		canvas.resize();
	};
	gl.render = function(userApp) {
		this.clear(this.COLOR_BUFFER_BIT | this.DEPTH_BUFFER_BIT | this.STENCIL_BUFFER_BIT);
		mat4.identity(matrix.m);
		if (cnv.camera._auto === true)
			cnv.camera._lookAtAuto();
		cnv.cubemap.render();
		cnv.grid.render();
		cnv.events.exec('render', cnv);
	}
	// Initialisation
	gl.clearColor(0.07, 0.07, 0.07, 1);
	gl.enable(gl.DEPTH_TEST);
	gl.enable(gl.BLEND);
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
};
