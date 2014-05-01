Canvasloth.prototype.Primitives3D = function() {
	var objects = this.webgl.objects;
	this.primitives = {
		create: function(a) {
			var alpha = a.a !== undefined ? a.a : 255,
				type = a.type.toLowerCase();
			switch (type) {
				case 'cube':
				case 'cubemap':
					return this.cuboid(
						type,
						a.size, a.size, a.size,
						a.r, a.g, a.b, alpha
					);
				case 'box':
				case 'cuboid':
					return this.cuboid(
						type,
						a.sizeX, a.sizeY, a.sizeZ,
						a.r, a.g, a.b, alpha
					);
				case 'sphere':
					var radius = a.radius !== undefined ? a.radius : a.diameter / 2;
					return this.ellipsoid(
						radius, radius, radius,
						a.latitudes || 16, a.longitudes || 16,
						a.r, a.g, a.b, alpha
					);
				case 'ellipsoid':
					return this.ellipsoid(
						a.sizeX, a.sizeY, a.sizeZ,
						a.latitudes || 16, a.longitudes || 16,
						a.r, a.g, a.b, alpha
					);
			}
		},
		cuboid: function(type, x, y, z, r, g, b, a) {
			var f = 0.001;
			x /= 2;
			y /= 2;
			z /= 2;
			return objects.create({
				ind: [
					 0,  1,  2,      0,  2,  3, // +Z (top)
					 4,  5,  6,      4,  6,  7, // +X
					 8,  9, 10,      8, 10, 11, // +Y
					12, 13, 14,     12, 14, 15, // -X
					16, 17, 18,     16, 18, 19, // -Y 11,00,10   11,01,00
					20, 21, 22,     20, 22, 23  // -Z (bottom)
				],
				vtx: [
					 x, y, z,  -x, y, z,  -x,-y, z,   x,-y, z, //   0  1  2  3   +Z (top)
					 x, y, z,   x,-y, z,   x,-y,-z,   x, y,-z, //   4  5  6  7   +X
					 x, y, z,   x, y,-z,  -x, y,-z,  -x, y, z, //   8  9 10 11   +Y
					-x, y, z,  -x, y,-z,  -x,-y,-z,  -x,-y, z, //  12 13 14 15   -X
					-x,-y,-z,   x,-y,-z,   x,-y, z,  -x,-y, z, //  16 17 18 19   -Y
					 x,-y,-z,  -x,-y,-z,  -x, y,-z,   x, y,-z  //  20 21 22 23   -Z (bottom)
				],
				nrm: [
					 0, 0, 1,   0, 0, 1,   0, 0, 1,   0, 0, 1, // +Z (top)
					 1, 0, 0,   1, 0, 0,   1, 0, 0,   1, 0, 0, // +X
					 0, 1, 0,   0, 1, 0,   0, 1, 0,   0, 1, 0, // +Y
					-1, 0, 0,  -1, 0, 0,  -1, 0, 0,  -1, 0, 0, // -X
					 0,-1, 0,   0,-1, 0,   0,-1, 0,   0,-1, 0, // -Y
					 0, 0,-1,   0, 0,-1,   0, 0,-1,   0, 0,-1  // -Z (bottom)
				],
				tex: type === 'cubemap' ? [
					/*
						Patron du cube (en respectant les ^2)
						** +Z -Z **
						-X +Y +X -Y
					*/
					0.50-f,0.50-f,  0.25+f,0.50-f,  0.25+f,0.00+f,  0.50-f,0.00+f, // +Z (top)
					0.50+f,0.50+f,  0.75-f,0.50+f,  0.75-f,1.00-f,  0.50+f,1.00-f, // +X
					0.50-f,0.50+f,  0.50-f,1.00-f,  0.25+f,1.00-f,  0.25+f,0.50+f, // +Y
					0.25-f,0.50+f,  0.25-f,1.00-f,  0.00+f,1.00-f,  0.00+f,0.50+f, // -X
					1.00-f,1.00-f,  0.75+f,1.00-f,  0.75+f,0.50+f,  1.00-f,0.50+f, // -Y
					0.75-f,0.50-f,  0.50+f,0.50-f,  0.50+f,0.00+f,  0.75-f,0.00+f  // -Z (bottom)
				] : [
					1,1,        0,1,       0,0,       1,0,     // +Z (top)
					0,0,        1,0,       1,1,       0,1,     // +X
					1,0,        1,1,       0,1,       0,0,     // +Y
					1,0,        1,1,       0,1,       0,0,     // -X
					1,1,        0,1,       0,0,       1,0,     // -Y
					1,1,        0,1,       0,0,       1,0      // -Z (bottom)
				],
				col: [
					r,g,b,a,    r,g,b,a,   r,g,b,a,   r,g,b,a, // +Z (top)
					r,g,b,a,    r,g,b,a,   r,g,b,a,   r,g,b,a, // +X
					r,g,b,a,    r,g,b,a,   r,g,b,a,   r,g,b,a, // +Y
					r,g,b,a,    r,g,b,a,   r,g,b,a,   r,g,b,a, // -X
					r,g,b,a,    r,g,b,a,   r,g,b,a,   r,g,b,a, // -Y
					r,g,b,a,    r,g,b,a,   r,g,b,a,   r,g,b,a  // -Z (bottom)
				]
			});
		},
		ellipsoid: function(sizeX, sizeY, sizeZ, nbLtt, nbLgt, r, g, b, a) {
			var ind = [],
				vtx = [], nrm = [],
				tex = [], col = [],
				ltt, lgt;

			for (ltt = 0; ltt <= nbLtt; ++ltt) {
				var theta = ltt * Math.PI / nbLtt,
					sinTheta = Math.sin(theta),
					cosTheta = Math.cos(theta);
				for (lgt = 0; lgt <= nbLgt; ++lgt) {
					var phi = lgt * 2 * Math.PI / nbLgt,
						sinPhi = Math.sin(phi),
						cosPhi = Math.cos(phi),
						x = cosPhi * sinTheta,
						y = sinPhi * sinTheta,
						z = cosTheta,
						u = 1 - (lgt / nbLgt),
						v = 1 - (ltt / nbLtt);
					nrm.push(x, y, z);
					col.push(r, g, b, a);
					vtx.push(sizeX * x, sizeY * y, sizeZ * z);
				}
			}

			for (ltt = 0; ltt < nbLtt; ++ltt)
				for (lgt = 0; lgt < nbLgt; ++lgt) {
					var first  = (ltt * (nbLgt + 1)) + lgt,
						second = first + nbLgt + 1;
					ind.push(
						first,    second,
						first+1,  second,
						second+1, first+1
					);
					tex.push(1,1,  1,1);
				}

			return objects.create({
				ind: ind,
				vtx: vtx,
				nrm: nrm,
				tex: tex,
				col: col
			});
		}
	};
};
