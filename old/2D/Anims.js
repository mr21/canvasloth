Canvasloth.prototype.Anims2D = function() {
	var cnv = this;
	this.anims = {
		create: function(arg) {
			return new Canvasloth.Anim2D(arg, cnv);
		}
	};
};

// arg      | defValue
// ---------+----------------
// img      | 
// x        | 0
// y        | 0
// w        | img.width  - x
// h        | img.height - y
// cx       | Canvasloth.CENTER
// cy       | Canvasloth.CENTER
// nbFrames |
// returnTo | -1
// loop     | false
// duration |
Canvasloth.Anim2D = function(arg, cnv) {
	this.times = cnv.times;
	this.sprite = cnv.sprites.create(arg);
	this.framesAxeX = arg.nbFrames > 0;
	this.nbFrames = Math.abs(arg.nbFrames);
	this.returnTo = arg.returnTo !== undefined ? arg.returnTo : -1;
	this.loop = arg.loop !== undefined ? arg.loop : false;
	this.delay = arg.duration / this.nbFrames;
	this.frame = this.returnTo === -1 ? -1 : 0;
	this.timePrev = this.times.real;
	this.pause();
};

Canvasloth.Anim2D.prototype = {
	opacity: function(a) {
		return this.sprite.opacity(a);
	},
	draw: function(x, y) {
		if (this.frame > -1) {
			this.sprite.draw(x, y);
			this._update(this.times);
		}
	},
	play: function() {
		this.playing = true;
		if (this.frame === -1)
			this._moveFrame(+1);
	},
	pause: function() {
		this.playing = false;
	},
	stop: function() {
		this.playing = false;
		this._moveFrame(-this.frame - (this.returnTo === -1));
	},
	rewind: function() {
	},
	progress: function() {
		return this.frame / this.nbFrames;
	},
	_moveFrame: function(f) {
		this.frame += f;
		if (this.framesAxeX)
			this.sprite.x += this.sprite.w * f;
		else
			this.sprite.y += this.sprite.h * f;
	},
	_update: function(times) {
		if (!this.playing) {
			this.timePrev = times.real;
		} else {
			var nbDelay = Math.floor((times.real - this.timePrev) / this.delay);
			if (nbDelay >= 1) {
				if (this.frame + nbDelay >= this.nbFrames - 1) {
					this._moveFrame(this.returnTo - this.frame);
					if (!this.loop)
						this.pause();
				} else {
					this._moveFrame(nbDelay);
					this.timePrev = times.real;
				}
			}
		}
	}
};
