Canvasloth.prototype.Camera2D = function() {
	var ctx = this.ctx;
	this.camera = {
		V2cam: new Canvasloth.Math.V2(0, 0),
		lookAt: function(x, y) {
			if (y === undefined)
				this.V2cam.setV(x);
			else
				this.V2cam.setF(x, y);
			return this;
		}
	};
};
