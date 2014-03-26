Canvasloth.Ctx3D = function(canvasloth, container) {
	// Creation du context
	this.canvas = canvasloth.canvas;
	this.events = canvasloth.events;
	var gl = this.ctx =
		this.canvas.getContext('webgl') ||
		this.canvas.getContext('experimental-webgl');
	// Initialisation
	gl.matrix = new gl.Matrix();
	gl.camera = new gl.Camera(gl, canvasloth);
	gl.shader = new gl.Shader(gl, container);
	gl.light  = new gl.Light(gl);
	gl.object = new gl.Object(gl);
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
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);
		mat4.identity(gl.matrix.m);
		if (gl.camera._auto === true)
				gl.camera._lookAtAuto();
		this.events.call('render', gl);
	}
};
