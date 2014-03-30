Canvasloth.prototype.Ctx2D = function() {
	var cnv = this,
	    canvas = this.canvas,
	    ctx = this.ctx = this.gl =
	    	canvas.getContext('2d');
	ctx.resize = function() {
		canvas.resize();
	};
	ctx.render = function(userApp) {
		this.clearRect(0, 0, canvas.width(), canvas.height());
		cnv.matrix.push();
			cnv.matrix.translate(cnv.camera.V2cam.x, cnv.camera.V2cam.y);
				cnv.events.exec('render', cnv);
		cnv.matrix.pop();
	};
};
