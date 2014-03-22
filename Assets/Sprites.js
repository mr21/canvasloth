Canvasloth.Assets.Sprites = function(ctx, images) {
	this.ctx = ctx;
	this.images = images;
};

Canvasloth.Assets.Sprites.prototype = {
	//	{
	//		img:,
	//		x:0, y:0,
	//		w:img.width  - x,
	//		h:img.height - y,
	//		cx:Canvasloth.CENTER,
	//		cy:Canvasloth.CENTER
	//	}
	create: function(arg) {
		var sp = new Canvasloth.Assets.Sprites.Sprite();
		sp.opacity(1);
		sp.ctx = this.ctx;
		sp.src = this.images.find(arg.img);
		sp.x = arg.x || 0;
		sp.y = arg.y || 0;
		sp.w = arg.w || sp.src.width  - sp.x;
		sp.h = arg.h || sp.src.height - sp.y;
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
		sp.cx = ctr(arg.cx, sp.w, Canvasloth.LEFT, Canvasloth.CENTER, Canvasloth.RIGHT);
		sp.cy = ctr(arg.cy, sp.h, Canvasloth.TOP,  Canvasloth.CENTER, Canvasloth.BOTTOM);
		return sp;
	}
};

Canvasloth.Assets.Sprites.Sprite = function() {};
Canvasloth.Assets.Sprites.Sprite.prototype = {
	opacity: function(a) {
		if (a === undefined)
			return this.opacityValue;
		this.opacityValue = a;
	},
	draw: function(x, y) {
		x = x || 0;
		y = y || 0;
		this.ctx.globalAlpha = this.opacityValue;
		this.ctx.drawImage(
			this.src,
			this.x, this.y,
			this.w, this.h,
			x - this.cx,
			y - this.cy,
			this.w, this.h
		);
		this.ctx.globalAlpha = 1;
	}
};
