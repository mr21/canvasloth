Canvasloth.Assets.Anims = function(time, sprites) {
	this.time = time;
	this.sprites = sprites;
};

Canvasloth.Assets.Anims.prototype = {
	create: function(imgPath, x, y, w, h, nbFrames, returnTo, loop, delay) {
		var an = new Canvasloth.Assets.Anims.Anim();
		an.time = this.time;
		an.sprite = this.sprites.create(imgPath, x, y, w, h);
		an.framesAxeX = nbFrames > 0;
		an.nbFrames = Math.abs(nbFrames);
		an.returnTo = returnTo;
		an.loop = loop;
		an.delay = delay / an.nbFrames;
		an.frame = an.returnTo === -1 ? -1 : 0;
		an.timePrev = an.time.realTime;
		an.pause();
		return an;
	}
};

Canvasloth.Assets.Anims.Anim = function() {};
Canvasloth.Assets.Anims.Anim.prototype = {
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
