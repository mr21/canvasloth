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
	gl._nMatrixUniform  = gl.getUniformLocation(gl._shaders.program, 'u_normalMatrix');
	gl._M4mdlVLoc = gl.getUniformLocation(gl._shaders.program, 'u_modelViewProjMatrix');
	// gl.uniform3f(gl.getUniformLocation(gl._shaders.program, 'lightDir'), 1, 1, 1); // tmp
	gl._camera_eyX = 5; gl._camera_eyY = 5; gl._camera_eyZ = 5;
	gl._camera_ctX = 0; gl._camera_ctY = 0; gl._camera_ctZ = 0;
	gl._camera_upX = 0; gl._camera_upY = 0; gl._camera_upZ = 1;
	gl._camera_zoomRatio = 1.2;
	gl._dir_light_enabled = true;
	// * Matrices
	gl.translate = function(   x, y, z) { this._M4obj.translate(x, y, z); return this; };
	gl.scale     = function(   x, y, z) { this._M4obj.scale    (x, y, z); return this; };
	gl.rotate    = function(a, x, y, z) { this._M4obj.rotate(a, x, y, z); return this; };
	gl.save    = function() { this._M4stack.push(new J3DIMatrix4(this._M4obj)); return this; };
	gl.restore = function() { this._M4obj = this._M4stack.pop(); return this; };
	// * Camera
	gl.cameraFovy = function(z) { if (z !== undefined) this._fovy = z; return this._fovy; };
	gl.cameraNear = function(z) { if (z !== undefined) this._near = z; return this._near; };
	gl.cameraFar  = function(z) { if (z !== undefined) this._far  = z; return this._far;  };
	gl.cameraAuto = function() {
		if (!this._camera_auto_active) {
			var c = canvasloth;
			this._camera_auto_active = true;
			this._camera_eventMD = c.events.add('mousedown',  this, this._camera_mouseDown);
			this._camera_eventMU = c.events.add('mouseup',    this, this._camera_mouseUp);
			this._camera_eventMM = c.events.add('mousemove',  this, this._camera_mouseMove);
			this._camera_eventMS = c.events.add('mousewheel', this, this._camera_mouseWheel);
		}
	};
	gl.cameraManuel = function() {
		if (this._camera_auto_active) {
			var c = canvasloth;
			this._camera_auto_active = false;
			c.events.del('mousedown',  this._camera_eventMD);
			c.events.del('mouseup',    this._camera_eventMU);
			c.events.del('mousemove',  this._camera_eventMM);
			c.events.del('mousewheel', this._camera_eventMS);
		}
	};
	gl.cameraSpherique = function(a) {
		if (!a) {
			this.cameraManuel();
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
	gl.cameraRadius     = function(n) { if (n !== undefined) this._camera_ray = n; return this._camera_ray; };
	gl.cameraLongitude  = function(n) { if (n !== undefined) this._camera_phy = n; return this._camera_phy; };
	gl.cameraLatitude   = function(n) { if (n !== undefined) this._camera_the = n; return this._camera_the; };
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
	gl._auto_lookAt = function() {
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
	gl.lookAt = function(eyX, eyY, eyZ, ctX, ctY, ctZ, upX, upY, upZ) {
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
		this._M4nrm.setUniform(this, this._nMatrixUniform, false);
		// Construct the model-view * projection matrix and pass it in
		this._M4mvp.load(this._M4cam);
		this._M4mvp.multiply(this._M4obj);
		this._M4mvp.setUniform(this, this._M4mdlVLoc, false);
	};
	gl.drawObject = function(mode, count, type, indices) {
		this._setUniform();
		this.drawElements(mode, count, type, indices);
	};
	gl.createObject = function(type, vertices, normals, texCoords, faces, colors) {
		var obj = {
			type : type,
			vertices: {
				buffer: this.createBuffer(),
				itemNumber: vertices.length / 3,
				itemSize: 3,
				active: true
			},
			normals: {
				buffer: this.createBuffer(),
				itemNumber: normals.length / 3,
				itemSize: 3,
				active: true
			},
			faces: {
				buffer: this.createBuffer(),
				itemNumber: faces.length,
				itemSize: 1,
				active: true
			},
			texCoords: {
				buffer: this.createBuffer(),
				itemNumber: texCoords.length / 2,
				itemSize: 2,
				active: true
			},
			colors: {
				buffer: this.createBuffer(),
				itemNumber: colors.length / 4,
				itemSize: 4,
				active: true
			}
		};

		// Vertex des positions
		if (vertices !== undefined) {
			this.bindBuffer(this.ARRAY_BUFFER, obj.vertices.buffer);
			this.bufferData(this.ARRAY_BUFFER, new Float32Array(vertices), this.STATIC_DRAW);
		} else
			obj.vertices.active = false;

		// Vertex des normales
		if (normals !== undefined) {
			this.bindBuffer(this.ARRAY_BUFFER, obj.normals.buffer);
			this.bufferData(this.ARRAY_BUFFER, new Float32Array(normals), this.STATIC_DRAW);
		} else
			obj.normals.active = false;

		// Vertex des textures
		if (texCoords !== undefined) {
			this.bindBuffer(this.ARRAY_BUFFER, obj.texCoords.buffer);
			this.bufferData(this.ARRAY_BUFFER, new Float32Array(texCoords), this.STATIC_DRAW);
		} else
			obj.textCoords.active = false;

		// Vertex des index
		if (faces !== undefined) {
			this.bindBuffer(this.ELEMENT_ARRAY_BUFFER, obj.faces.buffer);
			this.bufferData(this.ELEMENT_ARRAY_BUFFER, new Uint8Array(faces), this.STATIC_DRAW);
		} else
			obj.faces.active = false;

		// Set up the vertex buffer for the colors
		if (colors !== undefined) {
			this.bindBuffer(this.ARRAY_BUFFER, obj.colors.buffer);
			this.bufferData(this.ARRAY_BUFFER, new Uint8Array(colors), this.STATIC_DRAW);
		} else
			obj.colors.active = false;

		this.bindBuffer(this.ELEMENT_ARRAY_BUFFER, null);
		return obj;
	};
	gl.bindObject = function(obj) {
		if (this._currentObj !== obj) {
			this._currentObj = obj;
			if (obj.vertices.active) {
				this.bindBuffer(this.ARRAY_BUFFER, obj.vertices.buffer);
				this.vertexAttribPointer(2, obj.vertices.itemSize, this.FLOAT, false, 0, 0);
			}
			if (obj.normals.active) {
				this.bindBuffer(this.ARRAY_BUFFER, obj.normals.buffer);
				this.vertexAttribPointer(0, obj.normals.itemSize, this.FLOAT, false, 0, 0);
			}
			if (obj.faces.active) {
				this.bindBuffer(this.ELEMENT_ARRAY_BUFFER, obj.faces.buffer);
			}
			if (obj.colors.active) {
				this.bindBuffer(this.ARRAY_BUFFER, obj.colors.buffer);
				this.vertexAttribPointer(1, obj.colors.itemSize, this.UNSIGNED_BYTE, true, 0, 0);
			}
		}
	};
	gl.ambientLightAttrib = function() {
		var prog = this._shaders.program;
		prog.useLightingUniform       = this.getUniformLocation(prog, "uUseLighting");
		prog.ambientColorUniform      = this.getUniformLocation(prog, "uAmbientColor");
	};
	gl.dirLightAttrib = function () {
		var prog = this._shaders.program;
		prog.lightingDirectionUniform = this.getUniformLocation(prog, "uLightingDirection");
		prog.directionalColorUniform  = this.getUniformLocation(prog, "uDirectionalColor");
	};
	gl.ambientLight = function(r, g, b) {
		gl.uniform1i(gl._shaders.program.useLightingUniform, true);
		gl.uniform3f(gl._shaders.program.ambientColorUniform, r, g, b);

	};
	gl.dirLight = function(lightDirX, lightDirZ, lightDirY, r, g, b) {
		var lightingDirection = [lightDirX, lightDirZ, lightDirY];
		var adjustedLD = vec3.create();
		vec3.normalize(lightingDirection, adjustedLD);
		vec3.scale(adjustedLD, -1);

		gl.uniform3fv(gl._shaders.program.lightingDirectionUniform, adjustedLD);
		gl.uniform3f(gl._shaders.directionalColorUniform, r, g, b);
	};
	gl.enableDirLight = function(activate) {
		gl._dir_light_enabled = activate;
		gl.uniform1i(gl._shaders.program.useLightingUniform, activate);
	};

	// Initialiser le context
	gl.clearColor(0.07, 0.07, 0.07, 1);
	gl.enable(gl.DEPTH_TEST);
	gl.enable(gl.BLEND);
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
	gl.cameraFovy(60);
	gl.cameraNear(1);
	gl.cameraFar(10000);
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
			gl._auto_lookAt();
		this.events.call('render', gl);
	}
};
