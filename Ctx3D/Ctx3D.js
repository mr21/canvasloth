Canvasloth.Ctx3D = function(canvas, container, ctx) {
	this.canvas = canvas;
	this.ctx = canvas.getContext('webgl') || canvas.getContext("experimental-webgl");
	this.shaders = new Canvasloth.Ctx3D.Shaders(container, ctx);
};

Canvasloth.Ctx3D.prototype = {
	resize: function() {
		this.canvas.resize();
		this.ctx.viewport(0, 0, this.canvas.width(), this.canvas.height());
	},
	render: function(userApp) {
		var c = this.ctx;
		c.clear(c.COLOR_BUFFER_BIT | c.DEPTH_BUFFER_BIT | c.STENCIL_BUFFER_BIT);
		userApp.render(c);
	}
};
