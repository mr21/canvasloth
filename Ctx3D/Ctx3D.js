Canvasloth.Ctx3D = function(cnv, container) {
	// Creation du context
	this.cnv = cnv;
	this.canvas = cnv.canvas;
	this.events = cnv.events;
	var gl = this.ctx =
		this.canvas.getContext('webgl') ||
		this.canvas.getContext('experimental-webgl');
	// Initialisation
	gl.clearColor(0.07, 0.07, 0.07, 1);
	gl.enable(gl.DEPTH_TEST);
	gl.enable(gl.BLEND);
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
};

Canvasloth.Ctx3D.prototype = {
	resize: function() {
		this.canvas.resize();
		var w = this.canvas.width(),
		    h = this.canvas.height();
		this.ctx.viewport(0, 0, w, h);
	},
	render: function(userApp) {
		var gl = this.ctx;
		var cnv = this.cnv;
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);
		mat4.identity(cnv.matrix.m);
		if (cnv.camera._auto === true)
			cnv.camera._lookAtAuto();
		this.events.exec('render', gl);
	}
};
