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
	gl.uniform3f(gl.getUniformLocation(gl._shaders.program, "lightDir"), 1, 1, 1); // tmp
	gl._camera_eyX = 5; gl._camera_eyY = 5; gl._camera_eyZ = 5;
	gl._camera_ctX = 0; gl._camera_ctY = 0; gl._camera_ctZ = 0;
	gl._camera_upX = 0; gl._camera_upY = 1; gl._camera_upZ = 0;
	// * Matrices
	gl._translate = function(   x, y, z) { this._M4obj.translate(x, y, z); return this; };
	gl._scale     = function(   x, y, z) { this._M4obj.scale    (x, y, z); return this; };
	gl._rotate    = function(a, x, y, z) { this._M4obj.rotate(a, x, y, z); return this; };
	gl._pushMatrix = function() { this._M4stack.push(new J3DIMatrix4(this._M4obj)); return this; };
	gl._popMatrix  = function() { this._M4obj = this._M4stack.pop(); return this; };
	// * Camera
	gl._fovy = function(f) { this._fovy = f; };
	gl._near = function(z) { this._near = z; };
	gl._far  = function(z) { this._far  = z; };
	gl._camera = function(a) {
		this._camera_auto_active = a;
		if (a) {
			this._camera_eventMD = canvas.addEvent('mousedown', this, this._camera_mouseDown);
			this._camera_eventMU = canvas.addEvent('mouseup',   this, this._camera_mouseUp);
			this._camera_eventMM = canvas.addEvent('mousemove', this, this._camera_mouseMove);
		} else {
			canvas.delEvent('mousedown', this._camera_eventMD);
			canvas.delEvent('mouseup',   this._camera_eventMU);
			canvas.delEvent('mousemove', this._camera_eventMM);
		}
	};
	gl._camera_mouseDown = function() {
		this._camera_moving = true;
	};
	gl._camera_mouseUp = function() {
		this._camera_moving = false;
	};
	gl._camera_mouseMove = function() {
		if (this._camera_moving) {
			//...
		}
	};
	gl._lookAt = function(eyX, eyY, eyZ, ctX, ctY, ctZ, upX, upY, upZ) {
		this._M4cam.makeIdentity();
		this._M4cam.perspective(
			this._fovy,
			canvas.width() / canvas.height(),
			this._near, this._far
		);
		this._M4cam.lookat(
			eyX, eyY, eyZ,
			ctX, ctY, ctZ,
			upX, upY, upZ
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
	gl.clearColor(0.07, 0.07, 0.07, 1);
	gl.enable(gl.DEPTH_TEST);
	gl.enable(gl.BLEND);
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
	gl._fovy(90);
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
		if (gl._camera_auto_active === true) {
			gl._lookAt(
				gl._camera_eyX, gl._camera_eyY, gl._camera_eyZ,
				gl._camera_ctX, gl._camera_ctY, gl._camera_ctZ,
				gl._camera_upX, gl._camera_upY, gl._camera_upZ
			);
		}
		userApp.render(gl);
	}
};
