Canvasloth.prototype.Grid3D = function() {
	var lights = this.lights,
		nbLines = 11,
		colorGray = 255,
		ind = [], vtx = [], nrm = [],
		col = [], tex = [], alpha,
		size = parseInt(nbLines / -2);

	for (var i = 0, coord = size; i < nbLines; ++i, ++coord)
		vtx.push(
			coord,-size,0,   coord,+size,0,
			-size,coord,0,   +size,coord,0
		);
	nbLines *= 2;
	for (var i = 0; i < nbLines; ++i) {
		ind.push(i*2,   i*2+1);
		nrm.push(0,0,1, 0,0,1);
		tex.push(0,0,   0,0);
		alpha = i === nbLines/2 || i === nbLines/2-1 ? 24 : 4;
		col.push(
			colorGray, colorGray, colorGray, alpha,
			colorGray, colorGray, colorGray, alpha
		);
	}

	this.grid = {
		enable: function() {
			this.active = true;
		},
		disable: function() {
			this.active = false;
		},
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

	this.grid.obj = this.objects.create({
		type: 'LINES',
		vtx: vtx,
		nrm: nrm,
		col: col,
		tex: tex,
		ind: ind
	});
	this.grid.enable();
};
