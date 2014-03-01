Canvasloth.Ctx2D = function(canvas) {
	this.canvas = canvas;
	this.ctx = canvas.getContext('2d');
	this.cam = new Canvasloth.Math.V2(0, 0);
};

Canvasloth.Ctx2D.prototype = {
	resize: function() {
		this.canvas.resize();
	},
	getCam: function() {
		return this.cam;
	},
	setCam: function(x, y) {
		if (y === undefined)
			this.cam.setV(x);
		else
			this.cam.setF(x, y);
	},
	render: function(userApp) {
		var c = this.ctx;
		c.clearRect(0, 0, this.canvas.width(), this.canvas.height());
		c.save();
			c.translate(this.cam.x, this.cam.y);
				userApp.render(c);
		c.restore();
	}
};
