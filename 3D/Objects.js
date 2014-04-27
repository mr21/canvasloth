Canvasloth.prototype.Objects3D = function() {
	var cnv = this,
	    gl = this.gl,
	    shaders = this.shaders,
	    matrix = this.matrix;
	this.objects = {
		create: function(data) {
			var obj = new Canvasloth.Object(gl, this);
			obj.type(data.type || 'TRIANGLES');
			obj.vtxBuf = gl.createBuffer(); obj.vtxNb = data.vtx.length / 3;
			obj.nrmBuf = gl.createBuffer(); obj.nrmNb = data.nrm.length / 3;
			obj.texBuf = gl.createBuffer(); obj.texNb = data.tex.length / 2;
			obj.colBuf = gl.createBuffer(); obj.colNb = data.col.length / 4;
			obj.indBuf = gl.createBuffer(); obj.indNb = data.ind.length / 1;
			gl.bindBuffer(gl.ARRAY_BUFFER,         obj.vtxBuf); gl.bufferData(gl.ARRAY_BUFFER,         new Float32Array(data.vtx), gl.STATIC_DRAW);
			gl.bindBuffer(gl.ARRAY_BUFFER,         obj.nrmBuf); gl.bufferData(gl.ARRAY_BUFFER,         new Float32Array(data.nrm), gl.STATIC_DRAW);
			gl.bindBuffer(gl.ARRAY_BUFFER,         obj.texBuf); gl.bufferData(gl.ARRAY_BUFFER,         new Float32Array(data.tex), gl.STATIC_DRAW);
			gl.bindBuffer(gl.ARRAY_BUFFER,         obj.colBuf); gl.bufferData(gl.ARRAY_BUFFER,         new Uint8Array  (data.col), gl.STATIC_DRAW);
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, obj.indBuf); gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array (data.ind), gl.STATIC_DRAW);
			return obj;
		},
		draw: function(obj) {
			// bind
			if (this._currentObj !== obj) {
				this._currentObj = obj;
				gl.bindBuffer(gl.ARRAY_BUFFER,         obj.vtxBuf); gl.vertexAttribPointer(2, 3 /*itemsize*/, gl.FLOAT,         false, 0, 0);
				gl.bindBuffer(gl.ARRAY_BUFFER,         obj.nrmBuf); gl.vertexAttribPointer(0, 3 /*itemsize*/, gl.FLOAT,         false, 0, 0);
				gl.bindBuffer(gl.ARRAY_BUFFER,         obj.colBuf); gl.vertexAttribPointer(1, 4 /*itemsize*/, gl.UNSIGNED_BYTE, true,  0, 0);
				gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, obj.indBuf);
			}
			// setUniform
			matrix.n = mat4.clone(matrix.m);
			mat4.invert(matrix.n, matrix.n);
			mat4.transpose(matrix.n, matrix.n);
			gl.uniformMatrix4fv(shaders.uNMatrix,  false, matrix.n);
			gl.uniformMatrix4fv(shaders.uPMatrix,  false, matrix.p);
			gl.uniformMatrix4fv(shaders.uMVMatrix, false, matrix.m);
			// draw
			gl.drawElements(
				obj._type,
				obj.indNb,
				gl.UNSIGNED_SHORT,
				0
			);
		}
	};
};

Canvasloth.Object = function(gl, parent) {
	this.gl = gl;
	this.parent = parent;
};

Canvasloth.Object.prototype = {
	draw: function() {
		return this.parent.draw(this), this;
	},
	type: function(t) {
		this._type = this.gl[t];
	}
};
