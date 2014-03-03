Canvasloth.Ctx3D = function(canvas, container) {
	this.canvas = canvas;
	// init
	this.ctx = canvas.getContext('webgl') || canvas.getContext("experimental-webgl");
	this.setFovy(30);
	this.setNear(1);
	this.setFar(10000);
	this.setClearColor(0, 0, 0, 1);
	this.shaders = new Canvasloth.Ctx3D.Shaders(container, this.ctx);
	var gl = this.ctx;
	gl.enable(gl.DEPTH_TEST);
	gl.enable(gl.BLEND);
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
	// Matrix
	this.vertexTriangles = this.ctx.createBuffer();
	this.M4stack = [];
	this.M4cam = new J3DIMatrix4();
	this.M4obj = new J3DIMatrix4();
	this.M4nrm = new J3DIMatrix4();
	this.M4mvp = new J3DIMatrix4();
	this.M4nrmLoc = gl.getUniformLocation(this.shaders.program, 'u_normalMatrix');
	this.M4mdlVLoc = gl.getUniformLocation(this.shaders.program, 'u_modelViewProjMatrix');
};

Canvasloth.Ctx3D.prototype = {
	// initialisation
	setClearColor: function(r, g, b, a) {
		this.ctx.clearColor(r, g, b, a);
	},
	setFovy: function(fovy) {
		this.fovy = fovy;
	},
	setNear: function(near) {
		this.near = near;
	},
	setFar: function(far) {
		this.far = far;
		this.ctx.clearDepth(far);
	},
	resize: function() {
		this.canvas.resize();
		var w = this.canvas.width(),
		    h = this.canvas.height();
		this.ctx.viewport(0, 0, w, h);
	},
	// camera
	lookAt: function(eyeX, eyeY, eyeZ, centerX, centerY, centerZ, upX, upY, upZ) {
		this.M4cam.makeIdentity();
		this.M4cam.perspective(
			this.fovy,
			this.canvas.width() / this.canvas.height(),
			this.near, this.far
		);
		this.M4cam.lookat(
			eyeX,    eyeY,    eyeZ,
			centerX, centerY, centerZ,
			upX,     upY,     upZ
		);
	},
	// transform
	translate: function(   x, y, z) { this.M4obj.translate(x, y, z); return this; },
	scale:     function(   x, y, z) { this.M4obj.scale    (x, y, z); return this; },
	rotate:    function(a, x, y, z) { this.M4obj.rotate(a, x, y, z); return this; },
	pushMatrix: function() { this.M4stack.push(new J3DIMatrix4(this.M4obj)); return this; },
	popMatrix : function() { this.M4obj = this.M4stack.pop(); return this; },
	// render
	setUniform: function() {
		// Construct the normal matrix from the model-view matrix and pass it in
		this.M4nrm.load(this.M4obj);
		this.M4nrm.invert();
		this.M4nrm.transpose();
		this.M4nrm.setUniform(this.ctx, this.M4nrmLoc, false);
		// Construct the model-view * projection matrix and pass it in
		this.M4mvp.load(this.M4cam);
		this.M4mvp.multiply(this.M4obj);
		this.M4mvp.setUniform(this.ctx, this.M4mdlVLoc, false);
	},
	drawElements: function(mode, count, type, indices) {
		this.setUniform();
		this.ctx.drawElements(mode, count, type, indices);
	},
	render: function(userApp) {
		var gl = this.ctx;
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);
		this.M4obj.makeIdentity();

		userApp.render(this);

		/*gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexTriangles);
		gl.drawElements(gl.TRIANGLES, this.vertexTriangles.length, gl.FLOAT, 0);*/
	}
};
