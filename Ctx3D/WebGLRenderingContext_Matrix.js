WebGLRenderingContext.prototype.Matrix = function() {
	this.stack = [];
	this.p = mat4.create(); // Projection
	this.m = mat4.create(); // Modelview
	this.n = mat4.create(); // Normal
	mat4.identity(this.p);
	mat4.identity(this.m);
	mat4.identity(this.n);
};

WebGLRenderingContext.prototype.Matrix.prototype = {
	translate : function(x, y, z) {
		mat4.translate(this.m, this.m, [x, y, z]);
		return this;
	},
	scale : function(x, y, z) {
		mat4.scale(this.m, this.m, [x, y, z]);
		return this;
	},
	rotate : function(a, x, y, z) {
		mat4.rotate(this.m, this.m, a, [x, y, z]);
		return this;
	},
	push : function() {
		this.stack.push(mat4.clone(this.m));
		return this;
	},
	pop : function() {
		this.m = this.stack.pop();
		return this;
	}
};
