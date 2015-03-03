Canvasloth.Math.M4 = function() {
	this.arr = new Float32Array(4 * 4);
	//this.identity();
};

Canvasloth.Math.M4.prototype = {
	getArray: function() {
		return this.arr;
	},
	setArray: function(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p) {
		var _ = this.arr;
		_[ 0]=a;     _[ 1]=b;     _[ 2]=c;     _[ 3]=d;
		_[ 4]=e;     _[ 5]=f;     _[ 6]=g;     _[ 7]=h;
		_[ 8]=i;     _[ 9]=j;     _[10]=k;     _[11]=l;
		_[12]=m;     _[13]=n;     _[14]=o;     _[15]=p;
		return this;
	},
	copy: function() {
		var _ = this.arr;
		return new Canvasloth.Math.M4().setArray(
			_[ 0], _[ 1], _[ 2], _[ 3],
			_[ 4], _[ 5], _[ 6], _[ 7],
			_[ 8], _[ 9], _[10], _[11],
			_[12], _[13], _[14], _[15]
		);
	},
	identity: function() {
		return this.setArray(
			1, 0, 0, 0,
			0, 1, 0, 0,
			0, 0, 1, 0,
			0, 0, 0, 1
		);
	},
	translate: function(x, y, z) {
		if (y === undefined) { z = x.z; y = x.y; x = x.x; }
		return this.multiplyM(new Canvasloth.Math.M4().setArray(
			1, 0, 0, x,
			0, 1, 0, y,
			0, 0, 1, z,
			0, 0, 0, 1
		));
	},
	scale: function(x, y, z) {
		if (y === undefined) { z = x.z; y = x.y; x = x.x; }
		return this.multiplyM(new Canvasloth.Math.M4().setArray(
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
		return this.multiplyM(new Canvasloth.Math.M4().setArray(
			xx+(1-xx)*c,   xy*c1-zs,      xz*c1+ys,      0,
			xy*c1+zs,      yy+(1-yy)*c,   yz*c1-xs,      0,
			xz*c1-ys,      yz*c1+xs,      zz+(1-zz)*c,   0,
			0,             0,             0,             1
		));
	},
	multiplyF: function(f) {
		var _ = this.arr;
		_[ 0]*=f; _[ 1]*=f; _[ 2]*=f; _[ 3]*=f;
		_[ 4]*=f; _[ 5]*=f; _[ 6]*=f; _[ 7]*=f;
		_[ 8]*=f; _[ 9]*=f; _[10]*=f; _[11]*=f;
		_[12]*=f; _[13]*=f; _[14]*=f; _[15]*=f;
		return this;
	},
	multiplyM: function(m) {
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
	},
	determ2x2: function(a, b, c, d) {
		return a * d - b * c;
	},
	determ3x3: function(a1, a2, a3, b1, b2, b3, c1, c2, c3) {
		return a1 * this.determ2x2(b2, b3, c2, c3)
		     - b1 * this.determ2x2(a2, a3, c2, c3)
		     + c1 * this.determ2x2(a2, a3, b2, b3);
	},
	determ4x4: function() {
		var _ = this.arr,
			a0 = _[ 0], b0 = _[ 1], c0 = _[ 2], d0 = _[ 3],
			a1 = _[ 4], b1 = _[ 5], c1 = _[ 6], d1 = _[ 7],
			a2 = _[ 8], b2 = _[ 9], c2 = _[10], d2 = _[11],
			a3 = _[12], b3 = _[13], c3 = _[14], d3 = _[15];
		return a0 * this.determ3x3(b1, b2, b3, c1, c2, c3, d1, d2, d3)
		     - b0 * this.determ3x3(a1, a2, a3, c1, c2, c3, d1, d2, d3)
		     + c0 * this.determ3x3(a1, a2, a3, b1, b2, b3, d1, d2, d3)
		     - d0 * this.determ3x3(a1, a2, a3, b1, b2, b3, c1, c2, c3);
	},
	adjoint: function() {
		var _ = this.arr,
			a0 = _[ 0], b0 = _[ 1], c0 = _[ 2], d0 = _[ 3],
			a1 = _[ 4], b1 = _[ 5], c1 = _[ 6], d1 = _[ 7],
			a2 = _[ 8], b2 = _[ 9], c2 = _[10], d2 = _[11],
			a3 = _[12], b3 = _[13], c3 = _[14], d3 = _[15];
		_[ 0] =  this.determ3x3(b1, b2, b3, c1, c2, c3, d1, d2, d3);
		_[ 1] = -this.determ3x3(a1, a2, a3, c1, c2, c3, d1, d2, d3);
		_[ 2] =  this.determ3x3(a1, a2, a3, b1, b2, b3, d1, d2, d3);
		_[ 3] = -this.determ3x3(a1, a2, a3, b1, b2, b3, c1, c2, c3);
		_[ 4] = -this.determ3x3(b0, b2, b3, c0, c2, c3, d0, d2, d3);
		_[ 5] =  this.determ3x3(a0, a2, a3, c0, c2, c3, d0, d2, d3);
		_[ 6] = -this.determ3x3(a0, a2, a3, b0, b2, b3, d0, d2, d3);
		_[ 7] =  this.determ3x3(a0, a2, a3, b0, b2, b3, c0, c2, c3);
		_[ 8] =  this.determ3x3(b0, b1, b3, c0, c1, c3, d0, d1, d3);
		_[ 9] = -this.determ3x3(a0, a1, a3, c0, c1, c3, d0, d1, d3);
		_[10] =  this.determ3x3(a0, a1, a3, b0, b1, b3, d0, d1, d3);
		_[11] = -this.determ3x3(a0, a1, a3, b0, b1, b3, c0, c1, c3);
		_[12] = -this.determ3x3(b0, b1, b2, c0, c1, c2, d0, d1, d2);
		_[13] =  this.determ3x3(a0, a1, a2, c0, c1, c2, d0, d1, d2);
		_[14] = -this.determ3x3(a0, a1, a2, b0, b1, b2, d0, d1, d2);
		_[15] =  this.determ3x3(a0, a1, a2, b0, b1, b2, c0, c1, c2);
	},
	invert: function() {
		var det = this.determ4x4();
		if (Math.abs(det) < 1e-8)
			return this;
		this.adjoint();
		return this.multiplyF(1 / det);
	},
	transpose: function() {
		var _ = this.arr, tmp;
		tmp=_[ 1]; _[ 1]=_[ 4]; _[ 4]=tmp; // 01<>10
		tmp=_[ 2]; _[ 2]=_[ 8]; _[ 8]=tmp; // 02<>20
		tmp=_[ 3]; _[ 3]=_[12]; _[12]=tmp; // 03<>30
		tmp=_[ 6]; _[ 6]=_[ 9]; _[ 9]=tmp; // 12<>21
		tmp=_[ 7]; _[ 7]=_[13]; _[13]=tmp; // 13<>31
		tmp=_[11]; _[11]=_[14]; _[14]=tmp; // 23<>32
	}
};
