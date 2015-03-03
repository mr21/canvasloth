Canvasloth.prototype.Ctx3D = function() {
	var cnv = this,
		canvas = this.webgl.canvas,
		matrix = this.webgl.matrix,
		gl = this.gl;
	gl.resize = function() {
		canvas.resize();
	};
	gl.render = function(userApp) {
		if (cnv.camera._auto === true)
			cnv.camera._lookAtAuto();
		cnv.cubemap.render();
		cnv.grid.render();
		cnv.events.exec('render', cnv);
	};
};
