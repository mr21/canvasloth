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

	this.vertices  = { buffer:gl.createBuffer(), itemNumber:obj.vertices .length / 3 };
	this.normals   = { buffer:gl.createBuffer(), itemNumber:obj.normals  .length / 3 };
	this.texCoords = { buffer:gl.createBuffer(), itemNumber:obj.texCoords.length / 2 };
	this.colors    = { buffer:gl.createBuffer(), itemNumber:obj.colors   .length / 4 };
	this.indices   = { buffer:gl.createBuffer(), itemNumber:obj.indices  .length / 1 };

	gl.bindBuffer(gl.ARRAY_BUFFER,         this.vertices .buffer); gl.bufferData(gl.ARRAY_BUFFER,         new Float32Array(obj.vertices),  gl.STATIC_DRAW);
	gl.bindBuffer(gl.ARRAY_BUFFER,         this.normals  .buffer); gl.bufferData(gl.ARRAY_BUFFER,         new Float32Array(obj.normals),   gl.STATIC_DRAW);
	gl.bindBuffer(gl.ARRAY_BUFFER,         this.texCoords.buffer); gl.bufferData(gl.ARRAY_BUFFER,         new Float32Array(obj.texCoords), gl.STATIC_DRAW);
	gl.bindBuffer(gl.ARRAY_BUFFER,         this.colors   .buffer); gl.bufferData(gl.ARRAY_BUFFER,         new Uint8Array  (obj.colors),    gl.STATIC_DRAW);
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indices  .buffer); gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array (obj.indices),   gl.STATIC_DRAW);
};

Canvasloth.Object.prototype = {
	bind: function() {
		if (this.objects._currentObj !== this) {
			var gl = this.gl;
			this.objects._currentObj = this;

			gl.bindBuffer(gl.ARRAY_BUFFER, this.vertices.buffer);
			gl.vertexAttribPointer(2, 3 /*itemsize*/, gl.FLOAT, false, 0, 0);
		
			gl.bindBuffer(gl.ARRAY_BUFFER, this.normals.buffer);
			gl.vertexAttribPointer(0, 3 /*itemsize*/, gl.FLOAT, false, 0, 0);
		
			gl.bindBuffer(gl.ARRAY_BUFFER, this.colors.buffer);
			gl.vertexAttribPointer(1, 4 /*itemsize*/, gl.UNSIGNED_BYTE, true, 0, 0);
		
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indices.buffer);
		}
		return this;
	},
	draw: function(mode, count, type, indices) {
		this.objects._setUniform();
		this.gl.drawElements(mode, count, type, indices);
		return this;
	}
};
