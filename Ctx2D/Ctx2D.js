Canvasloth.Ctx2D = function(canvasloth) {
	var canvas = this.canvas = canvasloth.canvas;
	this.events = canvasloth.events;
	var ctx = this.ctx = canvas.getContext('2d');
	// Fonctionnalites additionnelles
	// * Attributs
	ctx.V2cam = new Canvasloth.Math.V2(0, 0);
	// * Camera
	ctx.lookAt = function(x, y) {
		if (y === undefined)
			this.V2cam.setV(x);
		else
			this.V2cam.setF(x, y);
	};
	ctx.width  = function() { return canvas.width();  };
	ctx.height = function() { return canvas.height(); };
};

Canvasloth.Ctx2D.prototype = {
	resize: function() {
		this.canvas.resize();
	},
	render: function(userApp) {
		var c = this.ctx;
		c.clearRect(0, 0, this.canvas.width(), this.canvas.height());
		c.save();
			c.translate(c.V2cam.x, c.V2cam.y);
				this.events.exec('render', c);
		c.restore();
	}
};
