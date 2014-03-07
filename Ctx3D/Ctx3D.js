Canvasloth.Ctx3D = function(canvasloth, container) {
	// Creation du context
	this.canvasloth = canvasloth;
	this.canvas = canvasloth.canvas;
	this.events = canvasloth.events;
	var gl = this.ctx =
		this.canvas.getContext('webgl') ||
		this.canvas.getContext('experimental-webgl');
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
	gl._camera_upX = 0; gl._camera_upY = 0; gl._camera_upZ = 1;
	gl._camera_zoomRatio = 1.2;
	// * Matrices
	gl._translate = function(   x, y, z) { this._M4obj.translate(x, y, z); return this; };
	gl._scale     = function(   x, y, z) { this._M4obj.scale    (x, y, z); return this; };
	gl._rotate    = function(a, x, y, z) { this._M4obj.rotate(a, x, y, z); return this; };
	gl._pushMatrix = function() { this._M4stack.push(new J3DIMatrix4(this._M4obj)); return this; };
	gl._popMatrix  = function() { this._M4obj = this._M4stack.pop(); return this; };
	// * Camera
	gl._camera_setFovy = function(f) { this._fovy = f; };
	gl._camera_setNear = function(z) { this._near = z; };
	gl._camera_setFar  = function(z) { this._far  = z; };
	gl._camera_auto = function() {
		if (!this._camera_auto_active) {
			var c = canvasloth;
			this._camera_auto_active = true;
			this._camera_eventMD = c.events.add('mousedown',  this, this._camera_mouseDown);
			this._camera_eventMU = c.events.add('mouseup',    this, this._camera_mouseUp);
			this._camera_eventMM = c.events.add('mousemove',  this, this._camera_mouseMove);
			this._camera_eventMS = c.events.add('mousewheel', this, this._camera_mouseWheel);
		}
	};
	gl._camera_manuel = function() {
		if (this._camera_auto_active) {
			var c = canvasloth;
			this._camera_auto_active = false;
			c.events.del('mousedown',  this._camera_eventMD);
			c.events.del('mouseup',    this._camera_eventMU);
			c.events.del('mousemove',  this._camera_eventMM);
			c.events.del('mousewheel', this._camera_eventMS);
		}
	};
	gl._camera_spherique = function(a) {
		if (!a) {
			this._camera_manuel();
		} else {
			var x = gl._camera_eyX,
			    y = gl._camera_eyY,
			    z = gl._camera_eyZ,
			    xxyy = x*x + y*y;
			this._camera_ray = Math.sqrt(xxyy + z*z);
			this._camera_th2 =
			this._camera_the = Math.acos(z / this._camera_ray);
			this._camera_phy = y >= 0
				?               Math.acos(x / Math.sqrt(xxyy))
				: 2 * Math.PI - Math.acos(x / Math.sqrt(xxyy));
		}
	};
	gl._camera_setRadius     = function(n) { this._camera_ray = n; };
	gl._camera_setLongitude  = function(n) { this._camera_phy = n; };
	gl._camera_setLatitude   = function(n) { this._camera_the = n; };
	gl._camera_getRadius     = function() { return this._camera_ray; };
	gl._camera_getLongitude  = function() { return this._camera_phy; };
	gl._camera_getLatitude   = function() { return this._camera_the; };
	gl._camera_mouseDown = function() { this._camera_moving = true;  };
	gl._camera_mouseUp   = function() { this._camera_moving = false; };
	gl._camera_mouseWheel = function(y) {
		this._camera_ray *= y > 0
			? this._camera_zoomRatio
			: (1 / this._camera_zoomRatio);
	};
	gl._camera_mouseMove = function(e) {
		if (this._camera_moving) {
			this._camera_phy -= offsetMouse.xRel / 120;
			this._camera_the -= offsetMouse.yRel / 120;
			this._camera_the %= 2 * Math.PI;
			if (this._camera_the > 0        !== this._camera_th2 > 0
			||  this._camera_the < +Math.PI !== this._camera_th2 < +Math.PI
			||  this._camera_the < -Math.PI !== this._camera_th2 < -Math.PI)
			{
				this._camera_upX = -this._camera_upX;
				this._camera_upY = -this._camera_upY;
				this._camera_upZ = -this._camera_upZ;
			}
			this._camera_th2 = this._camera_the;
		}
	};
	gl._setPerspective = function() {
		this._M4cam.makeIdentity();
		this._M4cam.perspective(
			this._fovy,
			canvasloth.canvas.width() / canvasloth.canvas.height(),
			this._near, this._far
		);
	};
	gl._lookAt_auto = function() {
		// Eye (coordonnees spheriques -> cartesiens)
		var sinTheta = Math.sin(this._camera_the);
		this._camera_eyX = this._camera_ray * Math.cos(this._camera_phy) * sinTheta;
		this._camera_eyY = this._camera_ray * Math.sin(this._camera_phy) * sinTheta;
		this._camera_eyZ = this._camera_ray * Math.cos(this._camera_the);
		// lookAt
		this._setPerspective();
		this._M4cam.lookat(
			this._camera_eyX,   this._camera_eyY,   this._camera_eyZ,
			this._camera_ctX,   this._camera_ctY,   this._camera_ctZ,
			this._camera_upX,   this._camera_upY,   this._camera_upZ
		);
	};
	gl._lookAt = function(eyX, eyY, eyZ, ctX, ctY, ctZ, upX, upY, upZ) {
		this._setPerspective();
		this._M4cam.lookat(
			this._camera_eyX=eyX,   this._camera_eyY=eyY,   this._camera_eyZ=eyZ,
			this._camera_ctX=ctX,   this._camera_ctY=ctY,   this._camera_ctZ=ctZ,
			this._camera_upX=upX,   this._camera_upY=upY,   this._camera_upZ=upZ
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
	gl._camera_setFovy(60);
	gl._camera_setNear(1);
	gl._camera_setFar(10000);
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
		if (gl._camera_auto_active === true)
			gl._lookAt_auto();
		this.events.call('render', gl);
	}
};
