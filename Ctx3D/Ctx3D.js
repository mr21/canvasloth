Canvasloth.Ctx3D = function(canvas, container) {
	this.canvas = canvas;
	this.ctx = canvas.getContext('webgl') || canvas.getContext("experimental-webgl");
	this.shaders = new Canvasloth.Ctx3D.Shaders(container, this.ctx);
	this.camM4 = new Canvasloth.Math.M4().identity();
	this.lookAt(
		0,  0, -1,
		0,  0,  0,
		0, +1,  0
	);
};

Canvasloth.Ctx3D.prototype = {
	resize: function() {
		this.canvas.resize();
		this.ctx.viewport(0, 0, this.canvas.width(), this.canvas.height());
		//... remettre la perspective
	},
	lookAt: function(eyeX, eyeY, eyeZ, centerX, centerY, centerZ, upX, upY, upZ) {
		if (centerX === undefined) {
			upZ     = eyeZ.z; upY     = eyeZ.y; upX     = eyeZ.x;
			centerZ = eyeY.z; centerY = eyeY.y; centerX = eyeY.x;
			eyeZ    = eyeX.z; eyeY    = eyeX.y; eyeX    = eyeX.x;
		}
		//... modifier this.camM4
	},
	render: function(userApp) {
		var c = this.ctx;
		c.clear(c.COLOR_BUFFER_BIT | c.DEPTH_BUFFER_BIT | c.STENCIL_BUFFER_BIT);
		//...
		userApp.render(c);
	}
};
