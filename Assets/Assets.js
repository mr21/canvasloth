// Assets ####################################
function Assets(ctx, time) {
	this.ctx = ctx;
	this.time = time;
	this.images = new this.Images();
	this.sprites = new this.Sprites(ctx, this.images);
}

Assets.prototype = {
	anim: function(x, y, w, h, nbFrames, returnTo, loop, delay, imgPath) {
		return new Assets.assetAnim(this, x, y, w, h, nbFrames, returnTo, loop, delay, imgPath);
	}
};

// assetAnim ####################################
Assets.assetAnim = function(assets, x, y, w, h, nbFrames, returnTo, loop, delay, imgPath) {
	this.time = assets.time;
	this.framesAxeX = nbFrames > 0;
	this.nbFrames   = Math.abs(nbFrames);
	this.returnTo   = returnTo;
	this.loop       = loop;
	this.delay      = delay / this.nbFrames;
	this.frame      = this.returnTo === -1 ? -1 : 0;
	this.sprite     = assets.sprites.create(imgPath, x, y, w, h);
	this.timePrev   = assets.time.realTime;
	this.pause();
};
Assets.assetAnim.prototype = {
	// public
	draw: function(x, y, debug) {
		if (this.frame > -1) {
			this.sprite.draw(x, y, debug);
			this.update(this.time);
		}
	},
	play: function() {
		this.playing = true;
		if (this.frame === -1)
			this.moveFrame(+1);
	},
	pause: function() {
		this.playing = false;
	},
	stop: function() {
		this.playing = false;
		this.moveFrame(-this.frame - (this.returnTo === -1));
	},
	rewind: function() {
	},
	// private
	moveFrame: function(f) {
		this.frame += f;
		if (this.framesAxeX)
			this.sprite.x += this.sprite.w * f;
		else
			this.sprite.y += this.sprite.h * f;
	},
	update: function(time) {
		if (!this.playing) {
			this.timePrev = time.realTime;
		} else {
			var nbDelay = Math.floor((time.realTime - this.timePrev) / this.delay);
			if (nbDelay >= 1) {
				if (this.frame + nbDelay >= this.nbFrames - 1) {
					this.moveFrame(this.returnTo - this.frame);
					if (!this.loop)
						this.pause();
				} else {
					this.moveFrame(nbDelay);
					this.timePrev = time.realTime;
				}
			}
		}
	}
};
