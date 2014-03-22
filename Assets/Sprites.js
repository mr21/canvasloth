Canvasloth.Assets.Sprites = function(ctx, images) {
	this.ctx = ctx;
	this.images = images;
};

Canvasloth.Assets.Sprites.prototype = {
	create: function(arg) { // {img:, x:, y:, w:, h:}
		var sp = new Canvasloth.Assets.Sprites.Sprite();
		sp.opacity(1);
		sp.ctx = this.ctx;
		sp.src = this.images.find(arg.img);
		sp.x = arg.x || 0;
		sp.y = arg.y || 0;
		sp.w = arg.w || sp.src.width  - sp.x;
		sp.h = arg.h || sp.src.height - sp.y;
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
		this.ctx.globalAlpha = this.opacityValue;
		this.ctx.drawImage(
			this.src,
			this.x, this.y,
			this.w, this.h,
			x,      y,
			this.w, this.h
		);
		this.ctx.globalAlpha = 1;
	}
};
