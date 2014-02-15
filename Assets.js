// Assets ####################################
function Assets(ctx, time) {
	this.ctx = ctx;
	this.time = time;
	this.images = [];
}

Assets.prototype = {
	// public
	loadImages: function(imgs, callback) {
		var i = 0, img, self = this,
			nbImagesToLoad = imgs.length;
		for (; i < imgs.length; ++i) {
			img = new Image();
			img.src = imgs[i];
			img.onload = function() {
				self.images.push(this);
				if (--nbImagesToLoad === 0 && callback)
					callback();
			};
		}
	},
	sprite: function(x, y, w, h, imgPath) {
		return new Assets.assetSprite(this, arguments);
	},
	anim: function(x, y, w, h, nbFrames, returnTo, loop, delay, imgPath) {
		return new Assets.assetAnim(this, arguments);
	},
	// private
	findImg: function(imgPath) {
		var img, ind;
		if (imgPath === undefined)
			img = this.images[0];
		else if (!isNaN(ind = parseInt(imgPath)))
			img = this.images[ind];
		else
			for (var i = 0; (img = this.images[i]) && img.src.indexOf(imgPath) === -1; ++i) {}
		return img || null;
	}
};

// assetSprite ####################################
Assets.assetSprite = function(assets, args) {
	this.src    = assets.findImg(args[4]);
	this.assets = assets;
	this.x      = args[0];
	this.y      = args[1];
	this.w      = args[2] || this.src.width  - this.x;
	this.h      = args[3] || this.src.height - this.y;
};
Assets.assetSprite.prototype = {
	// public
	draw: function(x, y, debug) {
		this.assets.ctx.drawImage(
			this.src,
			this.x, this.y,
			this.w, this.h,
			x,      y,
			this.w, this.h
		);
		if (debug) {
			this.assets.ctx.strokeStyle = 'rgba(255, 255, 50, 0.75)';
			this.assets.ctx.strokeRect(x, y, this.w, this.h);
		}
	}
};

// assetAnim ####################################
Assets.assetAnim = function(assets, args) {
	this.framesAxeX = args[4] > 0;
	this.nbFrames   = Math.abs(args[4]);
	this.returnTo   = args[5];
	this.loop       = args[6];
	this.delay      = args[7] / this.nbFrames;
	this.frame      = this.returnTo === -1 ? -1 : 0;
	args[4]         = args[8];
	this.sprite     = new Assets.assetSprite(assets, args);
	this.timePrev   = assets.time.realTime;
	this.pause();
};
Assets.assetAnim.prototype = {
	// public
	draw: function(x, y, debug) {
		if (this.frame > -1) {
			this.sprite.draw(x, y, debug);
			this.update(this.sprite.assets.time);
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
