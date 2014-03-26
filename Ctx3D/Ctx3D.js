Canvasloth.Ctx3D = function(canvasloth, container) {
	// Creation du context
	this.canvas = canvasloth.canvas;
	this.events = canvasloth.events;
	var gl = this.ctx =
		this.canvas.getContext('webgl') ||
		this.canvas.getContext('experimental-webgl');
	gl.matrix = new gl.Matrix();
	gl.camera = new gl.Camera(gl.matrix, canvasloth);
	// Fonctionnalites additionnelles
	// * Attributs
	gl._shaders  = new Canvasloth.Ctx3D.Shaders(container, gl);
	gl._shaders.uNMatrix  = gl.getUniformLocation(gl._shaders.program, 'uNMatrix');
	gl._shaders.uPMatrix  = gl.getUniformLocation(gl._shaders.program, 'uPMatrix');
	gl._shaders.uMVMatrix = gl.getUniformLocation(gl._shaders.program, 'uMVMatrix');
	gl._dir_light_enabled = true;
	// * Render
	gl._setUniform = function() {
		this.uniformMatrix4fv(this._shaders.uPMatrix, false, this.matrix.p);
		this.uniformMatrix4fv(this._shaders.uMVMatrix, false, this.matrix.m);
		gl.matrix.n = mat4.clone(gl.matrix.m);
		mat4.invert(gl.matrix.n, gl.matrix.n);
		mat4.transpose(gl.matrix.n, gl.matrix.n);
		this.uniformMatrix4fv(this._shaders.uNMatrix, false, this.matrix.n);
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

		if (!vertices) {
			obj.vertices.active = false;
		} else {
			this.bindBuffer(this.ARRAY_BUFFER, obj.vertices.buffer);
			this.bufferData(this.ARRAY_BUFFER, new Float32Array(vertices), this.STATIC_DRAW);
		}

		if (!normals) {
			obj.normals.active = false;
		} else {
			this.bindBuffer(this.ARRAY_BUFFER, obj.normals.buffer);
			this.bufferData(this.ARRAY_BUFFER, new Float32Array(normals), this.STATIC_DRAW);
		}

		if (!texCoords) {
			obj.textCoords.active = false;
		} else {
			this.bindBuffer(this.ARRAY_BUFFER, obj.texCoords.buffer);
			this.bufferData(this.ARRAY_BUFFER, new Float32Array(texCoords), this.STATIC_DRAW);
		}

		if (!faces) {
			obj.faces.active = false;
		} else {
			this.bindBuffer(this.ELEMENT_ARRAY_BUFFER, obj.faces.buffer);
			this.bufferData(this.ELEMENT_ARRAY_BUFFER, new Uint16Array(faces), this.STATIC_DRAW);
		}

		if (!colors) {
			obj.colors.active = false;
		} else {
			this.bindBuffer(this.ARRAY_BUFFER, obj.colors.buffer);
			this.bufferData(this.ARRAY_BUFFER, new Uint8Array(colors), this.STATIC_DRAW);
		}

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
	// Light
	gl.ambientLightAttrib = function() {
		var prog = this._shaders.program;
		prog.useAmbLightingUniform       = this.getUniformLocation(prog, "uUseAmbLighting");
		prog.ambientColorUniform      = this.getUniformLocation(prog, "uAmbientColor");
	};
	gl.dirLightAttrib = function () {
		var prog = this._shaders.program;
		prog.useDirLightingUniform       = this.getUniformLocation(prog, "uUseDirLighting");
		prog.lightingDirectionUniform = this.getUniformLocation(prog, "uLightingDirection");
		prog.directionalColorUniform  = this.getUniformLocation(prog, "uDirectionalColor");
	};
	gl.ambientLight = function(r, g, b) {
		gl.uniform1i(gl._shaders.program.useAmbLightingUniform, true);
		gl.uniform3f(gl._shaders.program.ambientColorUniform, r, g, b);

	};
	gl.dirLight = function(lightDirX, lightDirZ, lightDirY, r, g, b) {
		var lightingDirection = [lightDirX, lightDirZ, lightDirY];
		var adjustedLD = vec3.create();
		vec3.normalize(adjustedLD, lightingDirection);
		vec3.scale(adjustedLD, adjustedLD, -1);

		gl.uniform3fv(gl._shaders.program.lightingDirectionUniform, adjustedLD);
		gl.uniform3f(gl._shaders.program.directionalColorUniform, r, g, b);
	};
	gl.enableAmbLight = function(activate) {
		gl._amb_light_enabled = activate;
		gl.uniform1i(gl._shaders.program.useAmbLightingUniform, activate);
	};
	gl.enableDirLight = function(activate) {
		gl._dir_light_enabled = activate;
		gl.uniform1i(gl._shaders.program.useDirLightingUniform, activate);
	};
	// Initialiser le context
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
