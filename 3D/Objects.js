Canvasloth.prototype.Objects3D = function() {
	var cnv = this,
	    gl = this.gl,
	    shaders = this.shaders,
	    matrix = this.matrix;
	this.objects = {
		create: function(obj) {
			return new Canvasloth.Object(this, gl, obj);
		},
		_setUniform: function() {
			gl.uniformMatrix4fv(shaders.uPMatrix, false, matrix.p);
			gl.uniformMatrix4fv(shaders.uMVMatrix, false, matrix.m);
			matrix.n = mat4.clone(matrix.m);
			mat4.invert(matrix.n, matrix.n);
			mat4.transpose(matrix.n, matrix.n);
			gl.uniformMatrix4fv(shaders.uNMatrix, false, matrix.n);
		}
	};
};

Canvasloth.Object = function(objects, gl, obj) {
	this.objects = objects;
	this.gl = gl;

	this.vtxBuf = gl.createBuffer(); this.vtxNb = obj.vtx.length / 3;
	this.nrmBuf = gl.createBuffer(); this.nrmNb = obj.nrm.length / 3;
	this.texBuf = gl.createBuffer(); this.texNb = obj.tex.length / 2;
	this.colBuf = gl.createBuffer(); this.colNb = obj.col.length / 4;
	this.indBuf = gl.createBuffer(); this.indNb = obj.ind.length / 1;

	gl.bindBuffer(gl.ARRAY_BUFFER,         this.vtxBuf); gl.bufferData(gl.ARRAY_BUFFER,         new Float32Array(obj.vtx), gl.STATIC_DRAW);
	gl.bindBuffer(gl.ARRAY_BUFFER,         this.nrmBuf); gl.bufferData(gl.ARRAY_BUFFER,         new Float32Array(obj.nrm), gl.STATIC_DRAW);
	gl.bindBuffer(gl.ARRAY_BUFFER,         this.texBuf); gl.bufferData(gl.ARRAY_BUFFER,         new Float32Array(obj.tex), gl.STATIC_DRAW);
	gl.bindBuffer(gl.ARRAY_BUFFER,         this.colBuf); gl.bufferData(gl.ARRAY_BUFFER,         new Uint8Array  (obj.col), gl.STATIC_DRAW);
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indBuf); gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array (obj.ind), gl.STATIC_DRAW);
};

Canvasloth.Object.prototype = {
	bind: function() {
		if (this.objects._currentObj !== this) {
			var gl = this.gl;
			this.objects._currentObj = this;
			gl.bindBuffer(gl.ARRAY_BUFFER,         this.vtxBuf); gl.vertexAttribPointer(2, 3 /*itemsize*/, gl.FLOAT,         false, 0, 0);
			gl.bindBuffer(gl.ARRAY_BUFFER,         this.nrmBuf); gl.vertexAttribPointer(0, 3 /*itemsize*/, gl.FLOAT,         false, 0, 0);
			gl.bindBuffer(gl.ARRAY_BUFFER,         this.colBuf); gl.vertexAttribPointer(1, 4 /*itemsize*/, gl.UNSIGNED_BYTE, true,  0, 0);
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indBuf);
		}
		return this;
	},
	draw: function() {
		var gl = this.gl;
		this.objects._setUniform();
		gl.drawElements(
			gl.TRIANGLES,
			this.indNb,
			gl.UNSIGNED_SHORT,
			0
		);
		return this;
	}
};
