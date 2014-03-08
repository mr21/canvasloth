Canvasloth.Ctx2D = function(canvasloth) {
	this.canvas = canvasloth.canvas;
	this.events = canvasloth.events;
	var ctx = this.ctx = this.canvas.getContext('2d');
	// Fonctionnalites additionnelles
	// * Attributs
	ctx._V2cam = new Canvasloth.Math.V2(0, 0);
	// * Camera
	ctx.lookAt = function(x, y) {
		if (y === undefined)
			this._V2cam.setV(x);
		else
			this._V2cam.setF(x, y);
	};
};

Canvasloth.Ctx2D.prototype = {
	resize: function() {
		this.canvas.resize();
	},
	render: function(userApp) {
		var c = this.ctx;
		c.clearRect(0, 0, this.canvas.width(), this.canvas.height());
		c.save();
			c.translate(c._V2cam.x, c._V2cam.y);
				this.events.call('render', c);
		c.restore();
	}
};
