Canvasloth.Math.V2 = function(v, y) {
	if (y === undefined)
		this.setV(v);
	else
		this.setF(v, y);
}

Canvasloth.Math.V2.prototype = {
	copy: function() { return new Canvasloth.Math.V2(this); },
	normSquare: function() { return this.x*this.x + this.y*this.y; },
	norm: function() { return Math.sqrt(this.normSquare()); },
	    normalize: function() { return this.    divS(this.norm() || 1); },
	new_normalize: function() { return this.new_divS(this.norm() || 1); },
	    setV: function(v)    {                               this.x  = v.x; this.y  = v.y; return this; },
	    setF: function(x, y) {                               this.x  =   x; this.y  =   y; return this; },
	    addV: function(v)    {                               this.x += v.x; this.y += v.y; return this; },
	    addF: function(x, y) {                               this.x +=   x; this.y +=   y; return this; },
	new_addV: function(v)    { return new Canvasloth.Math.V2(this.x +  v.x, this.y +  v.y); },
	new_addF: function(x, y) { return new Canvasloth.Math.V2(this.x +    x, this.y +    y); },
	    subV: function(v)    {                               this.x -= v.x; this.y -= v.y; return this; },
	    subF: function(x, y) {                               this.x -=   x; this.y -=   y; return this; },
	new_subV: function(v)    { return new Canvasloth.Math.V2(this.x -  v.x, this.y -  v.y); },
	new_subF: function(x, y) { return new Canvasloth.Math.V2(this.x -    x, this.y -    y); },
	    mulV: function(v)    {                               this.x *= v.x; this.y *= v.y; return this; },
	    mulF: function(x, y) {                               this.x *=   x; this.y *=   y; return this; },
	    mulS: function(s)    {                               this.x *=   s; this.y *=   s; return this; },
	new_mulV: function(v)    { return new Canvasloth.Math.V2(this.x *  v.x, this.y *  v.y); },
	new_mulF: function(x, y) { return new Canvasloth.Math.V2(this.x *    x, this.y *    y); },
	new_mulS: function(s)    { return new Canvasloth.Math.V2(this.x *    s, this.y *    s); },
	    divV: function(v)    {                               this.x /= v.x; this.y /= v.y; return this; },
	    divF: function(x, y) {                               this.x /=   x; this.y /=   y; return this; },
	    divS: function(s)    {                               this.x /=   s; this.y /=   s; return this; },
	new_divV: function(v)    { return new Canvasloth.Math.V2(this.x /  v.x, this.y /  v.y); },
	new_divF: function(x, y) { return new Canvasloth.Math.V2(this.x /    x, this.y /    y); },
	new_divS: function(s)    { return new Canvasloth.Math.V2(this.x /    s, this.y /    s); }
};

Canvasloth.Math.V3 = function(v, y, z) {
	if (y === undefined)
		this.setV(v);
	else
		this.setF(v, y, z);
}

Canvasloth.Math.V3.prototype = {
	copy: function() { return new Canvasloth.Math.V3(this); },
	normSquare: function() { return this.x*this.x + this.y*this.y + this.z*this.z; },
	norm: function() { return Math.sqrt(this.normSquare()); },
	    normalize: function() { return this.    divS(this.norm() || 1); },
	new_normalize: function() { return this.new_divS(this.norm() || 1); },
	    setV: function(v)       {                               this.x  = v.x; this.y  = v.y; this.z  = v.z; return this; },
	    setF: function(x, y, z) {                               this.x  =   x; this.y  =   y; this.z  =   z; return this; },
	    addV: function(v)       {                               this.x += v.x; this.y += v.y; this.z += v.z; return this; },
	    addF: function(x, y, z) {                               this.x +=   x; this.y +=   y; this.z +=   z; return this; },
	new_addV: function(v)       { return new Canvasloth.Math.V3(this.x +  v.x, this.y +  v.y, this.z +  v.z); },
	new_addF: function(x, y, z) { return new Canvasloth.Math.V3(this.x +    x, this.y +    y, this.z +    z); },
	    subV: function(v)       {                               this.x -= v.x; this.y -= v.y; this.z -= v.z; return this; },
	    subF: function(x, y, z) {                               this.x -=   x; this.y -=   y; this.z -=   z; return this; },
	new_subV: function(v)       { return new Canvasloth.Math.V3(this.x -  v.x, this.y -  v.y, this.z -  v.z); },
	new_subF: function(x, y, z) { return new Canvasloth.Math.V3(this.x -    x, this.y -    y, this.z -    z); },
	    mulV: function(v)       {                               this.x *= v.x; this.y *= v.y; this.z *= v.z; return this; },
	    mulF: function(x, y, z) {                               this.x *=   x; this.y *=   y; this.z *=   z; return this; },
	    mulS: function(s)       {                               this.x *=   s; this.y *=   s; this.z *=   s; return this; },
	new_mulV: function(v)       { return new Canvasloth.Math.V3(this.x *  v.x, this.y *  v.y, this.z *  v.z); },
	new_mulF: function(x, y, z) { return new Canvasloth.Math.V3(this.x *    x, this.y *    y, this.z *    z); },
	new_mulS: function(s)       { return new Canvasloth.Math.V3(this.x *    s, this.y *    s, this.z *    s); },
	    divV: function(v)       {                               this.x /= v.x; this.y /= v.y; this.z /= v.z; return this; },
	    divF: function(x, y, z) {                               this.x /=   x; this.y /=   y; this.z /=   z; return this; },
	    divS: function(s)       {                               this.x /=   s; this.y /=   s; this.z /=   s; return this; },
	new_divV: function(v)       { return new Canvasloth.Math.V3(this.x /  v.x, this.y /  v.y, this.z /  v.z); },
	new_divF: function(x, y, z) { return new Canvasloth.Math.V3(this.x /    x, this.y /    y, this.z /    z); },
	new_divS: function(s)       { return new Canvasloth.Math.V3(this.x /    s, this.y /    s, this.z /    s); }
};
