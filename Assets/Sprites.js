Assets.prototype.Sprites = function(ctx, images) {
	this.ctx = ctx;
	this.images = images;
};

Assets.prototype.Sprites.prototype = {
	create: function(imgPath, x, y, w, h) {
		var sp = new this.Sprite(this.ctx, x, y, w, h);
		sp.src = this.images.find(imgPath);
		return sp;
	}
};

Assets.prototype.Sprites.prototype.Sprite = function(ctx, x, y, w, h) {
	this.ctx = ctx;
	this.x = x || 0;
	this.y = y || 0;
	this.w = w || this.src.width  - this.x;
	this.h = h || this.src.height - this.y;
};

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
