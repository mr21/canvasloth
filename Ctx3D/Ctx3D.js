Canvasloth.Ctx3D = function(canvas, container) {
	this.canvas = canvas;
	this.ctx = canvas.getContext('webgl') || canvas.getContext("experimental-webgl");
	this.fovy = 30;
	this.near = 1;
	this.far = 10000;
	this.shaders = new Canvasloth.Ctx3D.Shaders(container, this.ctx);
	this.M4perspective = new Canvasloth.Math.M4();
	this.M4cam = new Canvasloth.Math.M4().identity();
	this.vertexTriangles = [];
};

Canvasloth.Ctx3D.prototype = {
	resize: function() {
		this.canvas.resize();
		var w = this.canvas.width(),
		    h = this.canvas.height();
		this.ctx.viewport(0, 0, w, h);
		this.M4perspective.perspective(this.fovy, w / h, this.near, this.far);
	},
	// camera
	lookAt: function(eyeX, eyeY, eyeZ, centerX, centerY, centerZ, upX, upY, upZ) {
		this.M4perspective.lookAt(eyeX, eyeY, eyeZ, centerX, centerY, centerZ, upX, upY, upZ);
	},
	// transform
	translate: function(   x, y, z) { this.M4cam.translate(x, y, z); return this; },
	scale:     function(   x, y, z) { this.M4cam.scale    (x, y, z); return this; },
	rotate:    function(a, x, y, z) { this.M4cam.rotate(a, x, y, z); return this; },
	// render
	pushTriangle: function(arr) {
		this.vertexTriangles.concat(arr);
	},
	render: function(userApp) {
		var gl = this.ctx;
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);
		this.M4cam.identity();

		userApp.render(this);

		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexTriangles);
		gl.drawElements(gl.TRIANGLES, this.vertexTriangles.length, gl.FLOAT, 0);
	}
};
