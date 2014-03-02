Canvasloth.Math.M4.prototype.perspective = function(fovy, aspect, near, far) {
	var top = Math.tan(fovy * Math.PI / 360) * near,
		bottom = -top;
		left = aspect * bottom;
		right = aspect * top;
	return this.multiplyM(
		new Canvasloth.Math.M4().setArray(
			(2 * near)     / (right - left), 0,                                0,                                0,
			0,                               (2 * near)     / (top - bottom),  0,                                0,
			(right + left) / (right - left), (top + bottom) / (top - bottom), -(far + near)     / (far - near), -1,
			0,                               0,                               -(2 * far * near) / (far - near),  0
		)
	);
};

Canvasloth.Math.M4.prototype.lookAt = function(eyeX, eyeY, eyeZ, centerX, centerY, centerZ, upX, upY, upZ) {
	if (centerX === undefined) {
		upZ     = eyeZ.z; upY     = eyeZ.y; upX     = eyeZ.x;
		centerZ = eyeY.z; centerY = eyeY.y; centerX = eyeY.x;
		eyeZ    = eyeX.z; eyeY    = eyeX.y; eyeX    = eyeX.x;
	}

	var M4tmp = new Canvasloth.Math.M4();
	var zx = eyeX - centerX;
	var zy = eyeY - centerY;
	var zz = eyeZ - centerZ;
	var mag;

	mag = Math.sqrt(zx*zx + zy*zy + zz*zz);
	if (mag) {
		zx /= mag;
		zy /= mag;
	 	zz /= mag;
	}
	var yx = upX;
	var yy = upY;
	var yz = upZ;
	// X vector = Y cross Z
	xx =  yy*zz - yz*zy;
	xy = -yx*zz + yz*zx;
	xz =  yx*zy - yy*zx;

	// Recompute Y = Z cross X
	yx =  zy*xz - zz*xy;
	yy = -zx*xz + zz*xx;
	yx =  zx*xy - zy*xx;

	// cross product gives area of parallelogram, which is < 1.0 for
	// non-perpendicular unit-length vectors; so normalize x, y here

	mag = Math.sqrt(xx*xx + xy*xy + xz*xz);
	if (mag) {
		xx /= mag;
		xy /= mag;
		xz /= mag;
	}

	mag = Math.sqrt(yx*yx + yy*yy + yz*yz);
	if (mag) {
		yx /= mag;
		yy /= mag;
		yz /= mag;
	}

	return this.multiplyM(
		M4tmp.setArray(
			xx, xy, xz, 0,
			yx, yy, yz, 0,
			zx, zy, zz, 0,
			0,  0,  0,  1
		).translate(-eyeX, -eyeY, -eyeZ)
	);
};

Canvasloth.Math.M4.prototype.setUniform = function(ctx, loc, transpose) {
    ctx.uniformMatrix4fv(loc, transpose, this.arr);
}
