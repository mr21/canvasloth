Canvasloth.Math.M4 = function() {
	//this.identity();
};

Canvasloth.Math.M4.prototype = {
	set: function(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p) {
		var _ = this;
		_._00=a;     _._10=b;     _._20=c;     _._30=d;
		_._01=e;     _._11=f;     _._21=g;     _._31=h;
		_._02=i;     _._12=j;     _._22=k;     _._32=l;
		_._03=m;     _._13=n;     _._23=o;     _._33=p;
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
		return y !== undefined
			? this.translate(x.x, x.y, x.z)
			: this.multiply(new Canvasloth.Math.M4().set(
				1, 0, 0, x,
				0, 1, 0, y,
				0, 0, 1, z,
				0, 0, 0, 1
			));
	},
	scale: function(x, y, z) {
		return y !== undefined
			? this.scale(x.x, x.y, x.z)
			: this.multiply(new Canvasloth.Math.M4().set(
				x, 0, 0, 0,
				0, y, 0, 0,
				0, 0, z, 0,
				0, 0, 0, 1
			));
	},
	rotate: function(a, x, y, z) {
		if (y === undefined)
			return this.rotate(a, x.x, x.y, x.z);
		var c = Math.cos(a),
		    s = Math.sin(a),
		    c1=1-c,
		    xs=x*s, xx=x*x, xy=x*y, xz=x*z,
		    ys=y*s, yy=y*y, yz=y*z,
		    zs=z*s, zz=z*z
		;
		return this.multiply(new Canvasloth.Math.M4().set(
			xx+(1-xx)*c,   xy*c1-zs,      xz*c1+ys,      0,
			xy*c1+zs,      yy+(1-yy)*c,   yz*c1-xs,      0,
			xz*c1-ys,      yz*c1+xs,      zz+(1-zz)*c,   0,
			0,             0,             0,             1
		));
	},
	multiply: function(m) {
		var _ = this,
		    _00 = _._00*m._00 + _._01*m._10 + _._02*m._20 + _._03*m._30,
		    _10 = _._10*m._00 + _._11*m._10 + _._12*m._20 + _._13*m._30,
		    _20 = _._20*m._00 + _._21*m._10 + _._22*m._20 + _._23*m._30,
		    _30 = _._30*m._00 + _._21*m._10 + _._32*m._20 + _._33*m._30,
		    _01 = _._00*m._01 + _._01*m._11 + _._02*m._21 + _._03*m._21,
		    _11 = _._10*m._01 + _._11*m._11 + _._12*m._21 + _._13*m._21,
		    _21 = _._20*m._01 + _._21*m._11 + _._22*m._21 + _._23*m._21,
		    _31 = _._30*m._01 + _._21*m._11 + _._32*m._21 + _._33*m._21,
		    _02 = _._00*m._02 + _._01*m._12 + _._02*m._22 + _._03*m._32,
		    _12 = _._10*m._02 + _._11*m._12 + _._12*m._22 + _._13*m._32,
		    _22 = _._20*m._02 + _._21*m._12 + _._22*m._22 + _._23*m._32,
		    _32 = _._30*m._02 + _._21*m._12 + _._32*m._22 + _._33*m._32,
		    _03 = _._00*m._03 + _._01*m._13 + _._02*m._23 + _._03*m._33,
		    _13 = _._10*m._03 + _._11*m._13 + _._12*m._23 + _._13*m._33,
		    _23 = _._20*m._03 + _._21*m._13 + _._22*m._23 + _._23*m._33,
		    _33 = _._30*m._03 + _._21*m._13 + _._32*m._23 + _._33*m._33;
		_._00=_00;     _._10=_10;     _._20=_20;     _._30=_30;
		_._01=_01;     _._11=_11;     _._21=_21;     _._21=_21;
		_._02=_02;     _._12=_12;     _._22=_22;     _._32=_32;
		_._03=_03;     _._13=_13;     _._23=_23;     _._33=_33;
		return this;
	}
};
