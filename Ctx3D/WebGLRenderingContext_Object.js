WebGLRenderingContext.prototype.Object = function(gl) {
	this.gl = gl;
};

WebGLRenderingContext.prototype.Object.prototype = {
	_setUniform : function() {
		var gl = this.gl;
		gl.uniformMatrix4fv(gl.shader.uPMatrix, false, gl.matrix.p);
		gl.uniformMatrix4fv(gl.shader.uMVMatrix, false, gl.matrix.m);
		gl.matrix.n = mat4.clone(gl.matrix.m);
		mat4.invert(gl.matrix.n, gl.matrix.n);
		mat4.transpose(gl.matrix.n, gl.matrix.n);
		gl.uniformMatrix4fv(gl.shader.uNMatrix, false, gl.matrix.n);
	},
	draw : function(mode, count, type, indices) {
		this._setUniform();
		this.gl.drawElements(mode, count, type, indices);
	},
	bind : function(obj) {
		if (this._currentObj !== obj) {
			var gl = this.gl;
			this._currentObj = obj;
			if (obj.vertices.active) {
				gl.bindBuffer(gl.ARRAY_BUFFER, obj.vertices.buffer);
				gl.vertexAttribPointer(2, obj.vertices.itemSize, gl.FLOAT, false, 0, 0);
			}
			if (obj.normals.active) {
				gl.bindBuffer(gl.ARRAY_BUFFER, obj.normals.buffer);
				gl.vertexAttribPointer(0, obj.normals.itemSize, gl.FLOAT, false, 0, 0);
			}
			if (obj.faces.active) {
				gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, obj.faces.buffer);
			}
			if (obj.colors.active) {
				gl.bindBuffer(gl.ARRAY_BUFFER, obj.colors.buffer);
				gl.vertexAttribPointer(1, obj.colors.itemSize, gl.UNSIGNED_BYTE, true, 0, 0);
			}
		}
	},
	create : function(type, vertices, normals, texCoords, faces, colors) {
		var gl = this.gl,
			obj = {
			type : type,
			vertices: {
				buffer: gl.createBuffer(),
				itemNumber: vertices.length / 3,
				itemSize: 3,
				active: true
			},
			normals: {
				buffer: gl.createBuffer(),
				itemNumber: normals.length / 3,
				itemSize: 3,
				active: true
			},
			faces: {
				buffer: gl.createBuffer(),
				itemNumber: faces.length,
				itemSize: 1,
				active: true
			},
			texCoords: {
				buffer: gl.createBuffer(),
				itemNumber: texCoords.length / 2,
				itemSize: 2,
				active: true
			},
			colors: {
				buffer: gl.createBuffer(),
				itemNumber: colors.length / 4,
				itemSize: 4,
				active: true
			}
		};
		if (!vertices) {
			obj.vertices.active = false;
		} else {
			gl.bindBuffer(gl.ARRAY_BUFFER, obj.vertices.buffer);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
		}
		if (!normals) {
			obj.normals.active = false;
		} else {
			gl.bindBuffer(gl.ARRAY_BUFFER, obj.normals.buffer);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
		}
		if (!texCoords) {
			obj.textCoords.active = false;
		} else {
			gl.bindBuffer(gl.ARRAY_BUFFER, obj.texCoords.buffer);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW);
		}
		if (!faces) {
			obj.faces.active = false;
		} else {
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, obj.faces.buffer);
			gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(faces), gl.STATIC_DRAW);
		}
		if (!colors) {
			obj.colors.active = false;
		} else {
			gl.bindBuffer(gl.ARRAY_BUFFER, obj.colors.buffer);
			gl.bufferData(gl.ARRAY_BUFFER, new Uint8Array(colors), gl.STATIC_DRAW);
		}
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
		return obj;
	}
};
