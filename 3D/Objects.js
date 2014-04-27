Canvasloth.prototype.Objects3D = function() {
	var cnv = this,
	    gl = this.gl,
	    shaders = this.shaders,
	    matrix = this.matrix;
	this.objects = {
		create : function(vertices, normals, texCoords, faces, colors) {
			return new Canvasloth.Object(this, gl, vertices, normals, texCoords, faces, colors);
		},
		_setUniform : function() {
			gl.uniformMatrix4fv(shaders.uPMatrix, false, matrix.p);
			gl.uniformMatrix4fv(shaders.uMVMatrix, false, matrix.m);
			matrix.n = mat4.clone(matrix.m);
			mat4.invert(matrix.n, matrix.n);
			mat4.transpose(matrix.n, matrix.n);
			gl.uniformMatrix4fv(shaders.uNMatrix, false, matrix.n);
		}
	};
};

Canvasloth.Object = function(objects, gl, vertices, normals, texCoords, faces, colors) {
	this.objects = objects;
	this.gl = gl;
	this.vertices = {
		buffer: gl.createBuffer(),
		itemNumber: vertices.length / 3,
		itemSize: 3,
		active: true
	};
	this.normals = {
		buffer: gl.createBuffer(),
		itemNumber: normals.length / 3,
		itemSize: 3,
		active: true
	};
	this.faces = {
		buffer: gl.createBuffer(),
		itemNumber: faces.length,
		itemSize: 1,
		active: true
	};
	this.texCoords = {
		buffer: gl.createBuffer(),
		itemNumber: texCoords.length / 2,
		itemSize: 2,
		active: true
	};
	this.colors = {
		buffer: gl.createBuffer(),
		itemNumber: colors.length / 4,
		itemSize: 4,
		active: true
	};
	if (!vertices) {
		this.vertices.active = false;
	} else {
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertices.buffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	}
	if (!normals) {
		this.normals.active = false;
	} else {
		gl.bindBuffer(gl.ARRAY_BUFFER, this.normals.buffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
	}
	if (!texCoords) {
		this.textCoords.active = false;
	} else {
		gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoords.buffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW);
	}
	if (!faces) {
		this.faces.active = false;
	} else {
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.faces.buffer);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(faces), gl.STATIC_DRAW);
	}
	if (!colors) {
		this.colors.active = false;
	} else {
		gl.bindBuffer(gl.ARRAY_BUFFER, this.colors.buffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Uint8Array(colors), gl.STATIC_DRAW);
	}
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
};

Canvasloth.Object.prototype = {
	bind: function() {
		if (this.objects._currentObj !== this) {
			var gl = this.gl;
			this.objects._currentObj = this;
			if (this.vertices.active) {
				gl.bindBuffer(gl.ARRAY_BUFFER, this.vertices.buffer);
				gl.vertexAttribPointer(2, this.vertices.itemSize, gl.FLOAT, false, 0, 0);
			}
			if (this.normals.active) {
				gl.bindBuffer(gl.ARRAY_BUFFER, this.normals.buffer);
				gl.vertexAttribPointer(0, this.normals.itemSize, gl.FLOAT, false, 0, 0);
			}
			if (this.faces.active) {
				gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.faces.buffer);
			}
			if (this.colors.active) {
				gl.bindBuffer(gl.ARRAY_BUFFER, this.colors.buffer);
				gl.vertexAttribPointer(1, this.colors.itemSize, gl.UNSIGNED_BYTE, true, 0, 0);
			}
		}
		return this;
	},
	draw: function(mode, count, type, indices) {
		this.objects._setUniform();
		this.gl.drawElements(mode, count, type, indices);
		return this;
	}
};
