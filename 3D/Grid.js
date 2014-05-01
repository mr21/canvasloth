Canvasloth.prototype.Grid3D = function() {
	var lights = this.lights,
		nbLines = 11,
		ind = [], vtx = [], nrm = [],
		col = [], tex = [], alpha,
		size = parseInt(nbLines / -2),
		i, coord,
		r, g, b, a;

	for (i = 0, coord = size; i < nbLines; ++i, ++coord)
		vtx.push(
			coord,-size,0,   coord,+size,0,
			-size,coord,0,   +size,coord,0
		);
	nbLines *= 2;
	for (i = 0; i < nbLines; ++i) {
		ind.push(i*2,   i*2+1);
		nrm.push(0,0,1, 0,0,1);
		tex.push(0,0,   0,0);
		if (i % 2) { r=  0; g=0; b=196; a = i === nbLines/2   ? 255 : 64; }
		else       { r=196; g=0; b=  0; a = i === nbLines/2-1 ? 255 : 64; }
		col.push(
			r, g, b, a,
			r, g, b, a
		);
	}

	this.grid = {
		enable:  function() { this.active = true; },
		disable: function() { this.active = false; },
		toggle:  function() { this.active ? this.disable() : this.enable(); },
		render: function() {
			if (this.active) {
				var lightActive = lights.active;
				if (lightActive)
					lights.disable();
				this.obj.draw();
				if (lightActive)
					lights.enable();
			}
		}
	};

	this.grid.obj = this.webgl.objects.create({
		type: 'LINES',
		vtx: vtx,
		nrm: nrm,
		col: col,
		tex: tex,
		ind: ind
	});
	this.grid.enable();
};
