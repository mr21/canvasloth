function Vector2D(v, y) {
	if (y === undefined) {
		this.x = v.x;
		this.y = v.y;
	} else {
		this.x = v;
		this.y = y;
	}
}
Vector2D.prototype = {
	setXY:   function(x, y) { this.x  =   x; this.y  =   y; },
	addXY:   function(x, y) { this.x +=   x; this.y +=   y; },
	setVect: function(v)    { this.x  = v.x; this.y  = v.y; },
	addVect: function(v)    { this.x += v.x; this.y += v.y; },
	mul:     function(s)    { this.x *=   s; this.y *=   s; },
	div:     function(s)    { this.x /=   s; this.y /=   s; },
	norm: function() {
		return Math.sqrt(
			this.x * this.x +
			this.y * this.y
		);
	},
	normalize: function() {
		var n = this.norm();
		if (n) {
			this.x /= n;
			this.y /= n;
		}
	},
	show: function() {
		console.log('vector = {x:' + this.x + ', y:' + this.y + '}');
	}
};