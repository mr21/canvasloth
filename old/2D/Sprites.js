Canvasloth.prototype.Sprites2D = function() {
	var cnv = this;
	this.sprites = {
		create: function(arg) {
			return new Canvasloth.Sprite2D(arg, cnv);
		}
	};
};

// arg | defValue
// ----+-------------------
// img | 
// x   | 0
// y   | 0
// w   | img.width  - x
// h   | img.height - y
// cx  | Canvasloth.CENTER
// cy  | Canvasloth.CENTER
Canvasloth.Sprite2D = function(arg, cnv) {
	this.opacity(1);
	this.cnv = cnv;
	this.src = cnv.images.find(arg.img);
	this.x = arg.x || 0;
	this.y = arg.y || 0;
	this.w = arg.w || this.src.width  - this.x;
	this.h = arg.h || this.src.height - this.y;
	function ctr(val, wh, lt, cc, rb) {
		     if (lt - 1000000 < val && val < lt + 1000000)
			return val - lt;
		else if (cc - 1000000 < val && val < cc + 1000000)
			return val - cc + wh / 2;
		else if (rb - 1000000 < val && val < rb + 1000000)
			return val - rb + wh;
		return val;
	}
	if (arg.cx === undefined) arg.cx = Canvasloth.CENTER;
	if (arg.cy === undefined) arg.cy = Canvasloth.CENTER;
	this.cx = ctr(arg.cx, this.w, Canvasloth.LEFT, Canvasloth.CENTER, Canvasloth.RIGHT);
	this.cy = ctr(arg.cy, this.h, Canvasloth.TOP,  Canvasloth.CENTER, Canvasloth.BOTTOM);
};

Canvasloth.Sprite2D.prototype = {
	opacity: function(a) {
		if (a === undefined)
			return this.opacityValue;
		this.opacityValue = a;
	},
	drawImage: function(x, y) {
		var ctx = this.cnv.ctx;
		ctx.globalAlpha = this.opacityValue;
		ctx.drawImage(
			this.src,
			this.x, this.y,
			this.w, this.h,
			x,      y,
			this.w, this.h
		);
		ctx.globalAlpha = 1;
	},
	draw: function(x, y, z) {
		x = x || 0;
		y = y || 0;
		if (!z) {
			this.drawImage(x - this.cx, y - this.cy);
		} else {
			var cnv = this.cnv;
			z = Math.pow(z, 1.5);
			x += z * (-1 + (x + cnv.camera.V2cam.x) / cnv.canvas.width()  * 2);
			y += z * (-1 + (y + cnv.camera.V2cam.y) / cnv.canvas.height() * 2);
			z = 1 + z / 100;
			cnv.matrix.push();
				cnv.matrix.translate(x, y);
					cnv.matrix.scale(z, z);
						this.drawImage(-this.cx, -this.cy);
			cnv.matrix.pop();
		}
	}
};
