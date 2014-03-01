Canvasloth.Ctx2D = function(canvas) {
	this.canvas = canvas;
	this.ctx = canvas.getContext('2d');
	this.camV2 = new Canvasloth.Math.V2(0, 0);
};

Canvasloth.Ctx2D.prototype = {
	resize: function() {
		this.canvas.resize();
	},
	lookAt: function(x, y) {
		if (y === undefined)
			this.camV2.setV(x);
		else
			this.camV2.setF(x, y);
	},
	render: function(userApp) {
		var c = this.ctx;
		c.clearRect(0, 0, this.canvas.width(), this.canvas.height());
		c.save();
			c.translate(this.camV2.x, this.camV2.y);
				userApp.render(c);
		c.restore();
	}
};
