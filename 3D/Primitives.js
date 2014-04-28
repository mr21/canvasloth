Canvasloth.prototype.Primitives3D = function() {
	var objects = this.objects;
	this.primitives = {
		create: function(a) {
			var alpha = a.a !== undefined ? a.a : 255;
			switch (a.type) {
				case 'cube':
					return this.cuboid(
						a.size, a.size, a.size,
						a.r, a.g, a.b, alpha
					);
				case 'box':
				case 'cuboid':
					return this.cuboid(
						a.sizeX, a.sizeY, a.sizeZ,
						a.r, a.g, a.b, alpha
					);
				case 'sphere':
					var radius = a.radius !== undefined ? a.radius : a.diameter / 2;
					return this.ellipsoid(
						radius, radius, radius,
						a.latitude || 16, a.longitude || 16,
						a.r, a.g, a.b, alpha
					);
				case 'ellipsoid':
					return this.ellipsoid(
						a.sizeX, a.sizeY, a.sizeZ,
						a.latitude || 16, a.longitude || 16,
						a.r, a.g, a.b, alpha
					);
			}
		},
		cuboid: function(x, y, z, r, g, b, a) {
			x /= 2;
			y /= 2;
			z /= 2;
			return objects.create({
				ind: [
					 0,  1,  2,     0,  2,  3, // front
					 4,  5,  6,     4,  6,  7, // right
					 8,  9, 10,     8, 10, 11, // top
					12, 13, 14,    12, 14, 15, // left
					16, 17, 18,    16, 18, 19, // bottom
					20, 21, 22,    20, 22, 23  // back
				],
				vtx: [
					 x, y, z,  -x, y, z,  -x,-y, z,   x,-y, z,   // v0-v1-v2-v3 front
					 x, y, z,   x,-y, z,   x,-y,-z,   x, y,-z,   // v0-v3-v4-v5 right
					 x, y, z,   x, y,-z,  -x, y,-z,  -x, y, z,   // v0-v5-v6-v1 top
					-x, y, z,  -x, y,-z,  -x,-y,-z,  -x,-y, z,   // v1-v6-v7-v2 left
					-x,-y,-z,   x,-y,-z,   x,-y, z,  -x,-y, z,   // v7-v4-v3-v2 bottom
					 x,-y,-z,  -x,-y,-z,  -x, y,-z,   x, y,-z    // v4-v7-v6-v5 back
				],
				nrm: [
					 0, 0, 1,   0, 0, 1,   0, 0, 1,   0, 0, 1, // v0-v1-v2-v3 front
					 1, 0, 0,   1, 0, 0,   1, 0, 0,   1, 0, 0, // v0-v3-v4-v5 right
					 0, 1, 0,   0, 1, 0,   0, 1, 0,   0, 1, 0, // v0-v5-v6-v1 top
					-1, 0, 0,  -1, 0, 0,  -1, 0, 0,  -1, 0, 0, // v1-v6-v7-v2 left
					 0,-1, 0,   0,-1, 0,   0,-1, 0,   0,-1, 0, // v7-v4-v3-v2 bottom
					 0, 0,-1,   0, 0,-1,   0, 0,-1,   0, 0,-1  // v4-v7-v6-v5 back
				],
				tex: [
					1, 1,   0, 1,   0, 0,   1, 0, // v0-v1-v2-v3 front
					0, 1,   0, 0,   1, 0,   1, 1, // v0-v3-v4-v5 right
					1, 0,   1, 1,   0, 1,   0, 0, // v0-v5-v6-v1 top
					1, 1,   0, 1,   0, 0,   1, 0, // v1-v6-v7-v2 left
					0, 0,   1, 0,   1, 1,   0, 1, // v7-v4-v3-v2 bottom
					0, 0,   1, 0,   1, 1,   0, 1  // v4-v7-v6-v5 back
				],
				col: [
					r,g,b,a,  r,g,b,a,  r,g,b,a,  r,g,b,a, // v0-v1-v2-v3 front
					r,g,b,a,  r,g,b,a,  r,g,b,a,  r,g,b,a, // v0-v3-v4-v5 right
					r,g,b,a,  r,g,b,a,  r,g,b,a,  r,g,b,a, // v0-v5-v6-v1 top
					r,g,b,a,  r,g,b,a,  r,g,b,a,  r,g,b,a, // v1-v6-v7-v2 left
					r,g,b,a,  r,g,b,a,  r,g,b,a,  r,g,b,a, // v7-v4-v3-v2 bottom
					r,g,b,a,  r,g,b,a,  r,g,b,a,  r,g,b,a  // v4-v7-v6-v5 back
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
