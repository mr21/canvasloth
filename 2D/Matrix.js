Canvasloth.prototype.Matrix2D = function() {
	var ctx = this.ctx;
	this.matrix = {
		translate : function(x, y) { ctx.translate(x, y); return this; },
		scale     : function(x, y) { ctx.scale    (x, y); return this; },
		rotate    : function(a)    { ctx.rotate   (a);    return this; },
		push : function() { ctx.save();    return this; },
		pop  : function() { ctx.restore(); return this; }
	};
};
