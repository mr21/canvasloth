Canvasloth.Ctx2D = function(canvas) {
	this.canvas = canvas;
	var ctx = this.ctx = canvas.getContext('2d');
	// Fonctionnalites additionnelles
	// * Attributs
	ctx._V2cam = new Canvasloth.Math.V2(0, 0);
	// * Camera
	ctx._lookAt = function(x, y) {
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
				userApp.render(c);
		c.restore();
	}
};
