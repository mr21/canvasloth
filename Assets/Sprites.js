Assets.prototype.Sprites = function(ctx, images) {
	this.ctx = ctx;
	this.images = images;
};

Assets.prototype.Sprites.prototype = {
	create: function(imgPath, x, y, w, h) {
		var sp = new this.Sprite();
		sp.ctx = this.ctx;
		sp.src = this.images.find(imgPath);
		sp.x = x || 0;
		sp.y = y || 0;
		sp.w = w || sp.src.width  - sp.x;
		sp.h = h || sp.src.height - sp.y;
		return sp;
	}
};

Assets.prototype.Sprites.prototype.Sprite = function() {};
Assets.prototype.Sprites.prototype.Sprite.prototype = {
	draw: function(x, y, debug) {
		this.ctx.drawImage(
			this.src,
			this.x, this.y,
			this.w, this.h,
			x,      y,
			this.w, this.h
		);
		if (debug) {
			this.ctx.strokeStyle = 'rgba(255, 255, 50, 0.75)';
			this.ctx.strokeRect(x, y, this.w, this.h);
		}
	}
};
