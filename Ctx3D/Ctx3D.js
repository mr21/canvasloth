Canvasloth.Ctx3D = function(canvas, container, ctx) {
	this.canvas = canvas;
	this.ctx = canvas.getContext('webgl') || canvas.getContext("experimental-webgl");
	this.shaders = new Canvasloth.Ctx3D.Shaders(container, ctx);
	this.cam = {
		'eye'    : new Canvasloth.Math.V3(0, 0, -1), // la position de la camera.
		'center' : new Canvasloth.Math.V3(0, 0,  0), // ou regarde t-elle?
		'up'     : new Canvasloth.Math.V3(0, 1,  0)  // l'axe roll
	};
};

Canvasloth.Ctx3D.prototype = {
	resize: function() {
		this.canvas.resize();
		this.ctx.viewport(0, 0, this.canvas.width(), this.canvas.height());
	},
	getCam: function() {
		return this.cam;
	},
	setCam: function(eyeX, eyeY, eyeZ, centerX, centerY, centerZ, upX, upY, upZ) {
		if (centerX === undefined) {
			upZ     = eyeZ.z; upY     = eyeZ.y; upX     = eyeZ.x;
			centerZ = eyeY.z; centerY = eyeY.y; centerX = eyeY.x;
			eyeZ    = eyeX.z; eyeY    = eyeX.y; eyeX    = eyeX.x;
		}
		//...
	},
	render: function(userApp) {
		var c = this.ctx;
		c.clear(c.COLOR_BUFFER_BIT | c.DEPTH_BUFFER_BIT | c.STENCIL_BUFFER_BIT);
		userApp.render(c);
	}
};
