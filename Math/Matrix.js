Canvasloth.Math.M4 = function() {
	this.arr = new Float32Array(4 * 4);
	//this.identity();
};

Canvasloth.Math.M4.prototype = {
	set: function(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p) {
		var _ = this.arr;
		_[ 0]=a;     _[ 1]=b;     _[ 2]=c;     _[ 3]=d;
		_[ 4]=e;     _[ 5]=f;     _[ 6]=g;     _[ 7]=h;
		_[ 8]=i;     _[ 9]=j;     _[10]=k;     _[11]=l;
		_[12]=m;     _[13]=n;     _[14]=o;     _[15]=p;
		return this;
	},
	identity: function() {
		return this.set(
			1, 0, 0, 0,
			0, 1, 0, 0,
			0, 0, 1, 0,
			0, 0, 0, 1
		);
	},
	translate: function(x, y, z) {
		if (y === undefined) { z = x.z; y = x.y; x = x.x; }
		return this.multiply(new Canvasloth.Math.M4().set(
			1, 0, 0, x,
			0, 1, 0, y,
			0, 0, 1, z,
			0, 0, 0, 1
		));
	},
	scale: function(x, y, z) {
		if (y === undefined) { z = x.z; y = x.y; x = x.x; }
		return this.multiply(new Canvasloth.Math.M4().set(
			x, 0, 0, 0,
			0, y, 0, 0,
			0, 0, z, 0,
			0, 0, 0, 1
		));
	},
	rotate: function(a, x, y, z) {
		if (y === undefined) { z = x.z; y = x.y; x = x.x; }
		var c = Math.cos(a),
		    s = Math.sin(a),
		    c1=1-c,
		    xs=x*s, xx=x*x, xy=x*y, xz=x*z,
		    ys=y*s, yy=y*y, yz=y*z,
		    zs=z*s, zz=z*z;
		return this.multiply(new Canvasloth.Math.M4().set(
			xx+(1-xx)*c,   xy*c1-zs,      xz*c1+ys,      0,
			xy*c1+zs,      yy+(1-yy)*c,   yz*c1-xs,      0,
			xz*c1-ys,      yz*c1+xs,      zz+(1-zz)*c,   0,
			0,             0,             0,             1
		));
	},
	multiply: function(m) {
		m = m.arr;
		var _ = this.arr,
		    __0 = _[ 0]*m[ 0] + _[ 4]*m[ 1] + _[ 8]*m[ 2] + _[12]*m[ 3],
		    __1 = _[ 1]*m[ 0] + _[ 5]*m[ 1] + _[ 9]*m[ 2] + _[13]*m[ 3],
		    __2 = _[ 2]*m[ 0] + _[ 6]*m[ 1] + _[10]*m[ 2] + _[14]*m[ 3],
		    __3 = _[ 3]*m[ 0] + _[ 7]*m[ 1] + _[11]*m[ 2] + _[15]*m[ 3],
		    __4 = _[ 0]*m[ 4] + _[ 4]*m[ 5] + _[ 8]*m[ 6] + _[12]*m[ 7],
		    __5 = _[ 1]*m[ 4] + _[ 5]*m[ 5] + _[ 9]*m[ 6] + _[13]*m[ 7],
		    __6 = _[ 2]*m[ 4] + _[ 6]*m[ 5] + _[10]*m[ 6] + _[14]*m[ 7],
		    __7 = _[ 3]*m[ 4] + _[ 7]*m[ 5] + _[11]*m[ 6] + _[15]*m[ 7],
		    __8 = _[ 0]*m[ 8] + _[ 4]*m[ 9] + _[ 8]*m[10] + _[12]*m[11],
		    __9 = _[ 1]*m[ 8] + _[ 5]*m[ 9] + _[ 9]*m[10] + _[13]*m[11],
		    _10 = _[ 2]*m[ 8] + _[ 6]*m[ 9] + _[10]*m[10] + _[14]*m[11],
		    _11 = _[ 3]*m[ 8] + _[ 7]*m[ 9] + _[11]*m[10] + _[15]*m[11],
		    _12 = _[ 0]*m[12] + _[ 4]*m[13] + _[ 8]*m[14] + _[12]*m[15],
		    _13 = _[ 1]*m[12] + _[ 5]*m[13] + _[ 9]*m[14] + _[13]*m[15],
		    _14 = _[ 2]*m[12] + _[ 6]*m[13] + _[10]*m[14] + _[14]*m[15],
		    _15 = _[ 3]*m[12] + _[ 7]*m[13] + _[11]*m[14] + _[15]*m[15];
		_[ 0] = __0;     _[ 1] = __1;     _[ 2] = __2;     _[ 3] = __3;
		_[ 4] = __4;     _[ 5] = __5;     _[ 6] = __6;     _[ 7] = __7;
		_[ 8] = __8;     _[ 9] = __9;     _[10] = _10;     _[11] = _11;
		_[12] = _12;     _[13] = _13;     _[14] = _14;     _[15] = _15;
		return this;
	}
};
