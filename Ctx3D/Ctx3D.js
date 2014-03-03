Canvasloth.Ctx3D = function(canvas, container) {
	// Creation du context
	this.canvas = canvas;
	var gl = this.ctx =
		canvas.getContext('webgl') ||
		canvas.getContext("experimental-webgl");
	// Fonctionnalites additionnelles
	// * Attributs
	gl._shaders = new Canvasloth.Ctx3D.Shaders(container, gl);
	gl._M4stack = [];
	gl._M4cam = new J3DIMatrix4();
	gl._M4obj = new J3DIMatrix4();
	gl._M4nrm = new J3DIMatrix4();
	gl._M4mvp = new J3DIMatrix4();
	gl._M4nrmLoc  = gl.getUniformLocation(gl._shaders.program, 'u_normalMatrix');
	gl._M4mdlVLoc = gl.getUniformLocation(gl._shaders.program, 'u_modelViewProjMatrix');
	// * Matrices
	gl._translate = function(   x, y, z) { gl._M4obj.translate(x, y, z); return this; };
	gl._scale     = function(   x, y, z) { gl._M4obj.scale    (x, y, z); return this; };
	gl._rotate    = function(a, x, y, z) { gl._M4obj.rotate(a, x, y, z); return this; };
	gl._pushMatrix = function() { this._M4stack.push(new J3DIMatrix4(this._M4obj)); return this; };
	gl._popMatrix  = function() { this._M4obj = this._M4stack.pop(); return this; };
	// * Camera
	gl._fovy = function(f) { this._fovy = f; };
	gl._near = function(z) { this._near = z; };
	gl._far  = function(z) { this._far  = z; };
	gl._lookAt = function(eyeX, eyeY, eyeZ, centerX, centerY, centerZ, upX, upY, upZ) {
		this._M4cam.makeIdentity();
		this._M4cam.perspective(
			this._fovy,
			canvas.width() / canvas.height(),
			this._near, this._far
		);
		this._M4cam.lookat(
			eyeX,    eyeY,    eyeZ,
			centerX, centerY, centerZ,
			upX,     upY,     upZ
		);
	};
	// * Render
	gl._setUniform = function() {
		// Construct the normal matrix from the model-view matrix and pass it in
		this._M4nrm.load(this._M4obj);
		this._M4nrm.invert();
		this._M4nrm.transpose();
		this._M4nrm.setUniform(this, this._M4nrmLoc, false);
		// Construct the model-view * projection matrix and pass it in
		this._M4mvp.load(this._M4cam);
		this._M4mvp.multiply(this._M4obj);
		this._M4mvp.setUniform(this, this._M4mdlVLoc, false);
	};
	gl._drawElements = function(mode, count, type, indices) {
		this._setUniform();
		this.drawElements(mode, count, type, indices);
	};
	// Initialiser le context
	gl.clearColor(0, 0, 0, 1);
	gl.enable(gl.DEPTH_TEST);
	gl.enable(gl.BLEND);
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
	gl._fovy(30);
	gl._near(1);
	gl._far(10000);
};

Canvasloth.Ctx3D.prototype = {
	resize: function() {
		this.canvas.resize();
		var w = this.canvas.width(),
		    h = this.canvas.height();
		this.ctx.viewport(0, 0, w, h);
	},
	// render
	render: function(userApp) {
		var gl = this.ctx;
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);
		gl._M4obj.makeIdentity();
		userApp.render(gl);
	}
};
